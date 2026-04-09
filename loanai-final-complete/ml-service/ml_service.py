"""
LoanAI ML Service - Complete System
PostgreSQL Integration + XGBoost + Transaction Analysis + Fraud Detection
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import psycopg2
from psycopg2.extras import RealDictCursor
import pandas as pd
import numpy as np
from xgboost import XGBClassifier
from sklearn.preprocessing import StandardScaler
from sklearn.model_selection import train_test_split
import joblib
import os
from datetime import datetime
import json

app = Flask(__name__)
CORS(app)

# ═══════════════════════════════════════════════════════════════════
# DATABASE CONFIGURATION
# ═══════════════════════════════════════════════════════════════════

DB_CONFIG = {
    'host': 'localhost',
    'port': 5432,
    'database': 'loan_system',
    'user': 'postgres',
    'password': 'gvB@2004'
}

MODEL_PATH = 'models/xgboost_model.pkl'
SCALER_PATH = 'models/scaler.pkl'

# ═══════════════════════════════════════════════════════════════════
# ML SERVICE CLASS
# ═══════════════════════════════════════════════════════════════════

class LoanMLService:
    def __init__(self):
        self.model = None
        self.scaler = StandardScaler()
        self.load_or_train()
    
    def get_db_connection(self):
        """Get PostgreSQL connection"""
        return psycopg2.connect(**DB_CONFIG)
    
    def load_or_train(self):
        """Load existing model or train new one"""
        if os.path.exists(MODEL_PATH) and os.path.exists(SCALER_PATH):
            print("[INFO] Loading existing model...")
            self.model = joblib.load(MODEL_PATH)
            self.scaler = joblib.load(SCALER_PATH)
            print("[INFO] Model loaded successfully")
        else:
            print("[INFO] Training new model from database...")
            self.train_from_database()
    
    def train_from_database(self):
        """Train XGBoost model from PostgreSQL database"""
        conn = self.get_db_connection()
        
        query = """
        SELECT 
            c.age,
            c.monthly_income_declared as monthly_income,
            c.young_first_borrower_flag,
            c.risk_profile,
            a.current_balance as avg_balance
        FROM customer_master c
        JOIN account_master a ON c.cif_number = a.cif_number
        LIMIT 1000
        """
        
        df = pd.read_sql(query, conn)
        conn.close()
        
        # Create target variable
        df['approved'] = (df['risk_profile'] == 'LOW').astype(int)
        
        # Features
        X = df[['age', 'monthly_income', 'avg_balance', 'young_first_borrower_flag']].fillna(0)
        y = df['approved']
        
        # Split and train
        X_train, X_test, y_train, y_test = train_test_split(
            X, y, test_size=0.2, random_state=42
        )
        
        X_train_scaled = self.scaler.fit_transform(X_train)
        
        self.model = XGBClassifier(
            n_estimators=100,
            max_depth=6,
            learning_rate=0.1,
            random_state=42
        )
        self.model.fit(X_train_scaled, y_train)
        
        # Save model
        os.makedirs('models', exist_ok=True)
        joblib.dump(self.model, MODEL_PATH)
        joblib.dump(self.scaler, SCALER_PATH)
        
        print(f"[INFO] Model trained and saved successfully!")
    
    def analyze_transactions(self, cif_number):
        """
        Analyze transaction history from PostgreSQL
        Returns: simulated CIBIL, salary count, savings rate, etc.
        """
        if not cif_number:
            return self.get_default_transaction_analysis()
        
        conn = self.get_db_connection()
        cursor = conn.cursor(cursor_factory=RealDictCursor)
        
        # Get account numbers for this CIF
        cursor.execute("""
            SELECT account_number FROM account_master 
            WHERE cif_number = %s
        """, (cif_number,))
        
        accounts = cursor.fetchall()
        
        if not accounts:
            cursor.close()
            conn.close()
            return self.get_default_transaction_analysis()
        
        account_numbers = [acc['account_number'] for acc in accounts]
        
        # Get transactions (last 500)
        placeholders = ','.join(['%s'] * len(account_numbers))
        query = f"""
            SELECT 
                credit_amount,
                debit_amount,
                balance_after,
                narration,
                channel,
                fraud_flag,
                fraud_type
            FROM transaction_history
            WHERE account_number IN ({placeholders})
            ORDER BY transaction_date DESC
            LIMIT 500
        """
        
        cursor.execute(query, account_numbers)
        transactions = cursor.fetchall()
        
        cursor.close()
        conn.close()
        
        if not transactions:
            return self.get_default_transaction_analysis()
        
        # Analyze transactions
        salary_txns = [t for t in transactions 
                      if t['narration'] and 'SALARY' in t['narration'].upper()]
        
        fraud_txns = [t for t in transactions if t['fraud_flag'] == 1]
        
        cash_txns = [t for t in transactions 
                    if t['channel'] and 'CASH' in t['channel'].upper()]
        
        total_credits = sum(float(t['credit_amount'] or 0) for t in transactions)
        total_debits = sum(float(t['debit_amount'] or 0) for t in transactions)
        
        savings_rate = 0
        if total_credits > 0:
            savings_rate = (total_credits - total_debits) / total_credits
        
        avg_balance = np.mean([float(t['balance_after']) 
                              for t in transactions if t['balance_after']])
        
        cash_dependency = len(cash_txns) / len(transactions) if transactions else 0
        
        # Calculate simulated CIBIL
        cibil_score = self.calculate_simulated_cibil(
            salary_count=len(salary_txns),
            savings_rate=savings_rate,
            fraud_count=len(fraud_txns),
            avg_balance=avg_balance,
            cash_dependency=cash_dependency
        )
        
        return {
            'simulated_cibil': int(cibil_score),
            'salary_count': len(salary_txns),
            'savings_rate': float(savings_rate),
            'fraud_count': len(fraud_txns),
            'avg_balance': float(avg_balance),
            'cash_dependency': float(cash_dependency)
        }
    
    def calculate_simulated_cibil(self, salary_count, savings_rate, 
                                  fraud_count, avg_balance, cash_dependency):
        """
        Calculate simulated CIBIL score from transaction behavior
        Range: 300-850
        """
        base_score = 650  # Fair score for new borrowers
        
        # Salary stability
        if salary_count >= 6:
            base_score += 50
        elif salary_count >= 3:
            base_score += 25
        
        # Savings behavior
        if savings_rate > 0.20:
            base_score += 50
        elif savings_rate > 0.10:
            base_score += 25
        elif savings_rate < 0:
            base_score -= 30
        
        # Fraud penalty
        if fraud_count > 0:
            base_score -= 100
        
        # Average balance
        if avg_balance > 50000:
            base_score += 30
        elif avg_balance > 25000:
            base_score += 15
        elif avg_balance < 5000:
            base_score -= 20
        
        # Cash dependency
        if cash_dependency > 0.30:
            base_score -= 40
        elif cash_dependency > 0.20:
            base_score -= 20
        
        # Clamp between 300-850
        return max(300, min(850, base_score))
    
    def detect_fraud(self, features, transaction_data):
        """
        Detect 9 fraud patterns
        Returns fraud score (0-10) and list of flags
        """
        fraud_flags = []
        fraud_score = 0
        
        age = features.get('age', 25)
        employment_years = features.get('employment_years', 0)
        monthly_income = features.get('monthly_income', 0)
        loan_amount = features.get('loan_amount', 0)
        foir = features.get('foir', 0)
        
        # 1. Age-Employment Mismatch
        if employment_years > (age - 18):
            fraud_flags.append('AGE_EMPLOYMENT_MISMATCH')
            fraud_score += 3
        
        # 2. Irregular Salary
        if transaction_data['salary_count'] < 6:
            fraud_flags.append('IRREGULAR_SALARY_PATTERN')
            fraud_score += 2
        
        # 3. Excessive Cash
        if transaction_data['cash_dependency'] > 0.30:
            fraud_flags.append('EXCESSIVE_CASH_TRANSACTIONS')
            fraud_score += 2
        
        # 4. High FOIR
        if foir > 0.70:
            fraud_flags.append('EXCESSIVE_FOIR')
            fraud_score += 2
        
        # 5. Income-Loan Mismatch
        if monthly_income > 0:
            ratio = loan_amount / monthly_income
            if ratio > 60:
                fraud_flags.append('INCOME_LOAN_MISMATCH')
                fraud_score += 3
        
        # 6. Low Average Balance
        if loan_amount > 500000 and transaction_data['avg_balance'] < 10000:
            fraud_flags.append('LOW_AVERAGE_BALANCE')
            fraud_score += 2
        
        # 7. Historical Fraud Flags
        if transaction_data['fraud_count'] > 0:
            fraud_flags.append('HISTORICAL_FRAUD_FLAGS')
            fraud_score += 3
        
        # 8. Negative Savings
        if transaction_data['savings_rate'] < -0.10:
            fraud_flags.append('NEGATIVE_SAVINGS_PATTERN')
            fraud_score += 2
        
        # 9. Multiple Red Flags
        if len(fraud_flags) >= 3:
            fraud_flags.append('MULTIPLE_RED_FLAGS')
            fraud_score += 1
        
        # Determine risk level
        if fraud_score >= 5:
            risk_level = 'HIGH'
        elif fraud_score >= 3:
            risk_level = 'MEDIUM'
        else:
            risk_level = 'LOW'
        
        return {
            'fraud_score': fraud_score,
            'fraud_flags': fraud_flags,
            'fraud_risk': risk_level
        }
    
    def predict(self, features):
        """
        Main prediction function
        """
        cif_number = features.get('cif_number')
        
        # 1. Analyze transactions
        transaction_data = self.analyze_transactions(cif_number)
        
        # 2. Detect fraud
        fraud_result = self.detect_fraud(features, transaction_data)
        
        # 3. Prepare ML features
        ml_features = [
            features.get('age', 25),
            features.get('monthly_income', 50000),
            transaction_data['avg_balance'],
            features.get('young_first_borrower_flag', 0)
        ]
        
        # 4. Make prediction
        ml_features_scaled = self.scaler.transform([ml_features])
        probability = float(self.model.predict_proba(ml_features_scaled)[0][1])
        
        # 5. Property Boost (Manual heuristic)
        if features.get('has_property'):
            probability = min(1.0, probability + 0.15)  # Add 15% boost for property owners
        
        # 6. Calculate risk score
        risk_score = int(300 + (probability * 550))
        
        # 6. Determine decision
        simulated_cibil = transaction_data['simulated_cibil']
        
        if fraud_result['fraud_score'] >= 5:
            decision = 'REJECTED'
            probability = 0.0
        elif simulated_cibil < 450:
            decision = 'REJECTED'  # Hard reject for low credit behavior
        elif (probability >= 0.70 and simulated_cibil >= 600) or (probability >= 0.85):
            decision = 'APPROVED'
        elif probability >= 0.40 or simulated_cibil >= 750:
            decision = 'MANUAL_REVIEW'
        else:
            decision = 'REJECTED'
        
        # 7. Calculate interest rate
        if risk_score >= 750:
            interest_rate = 7.5
        elif risk_score >= 700:
            interest_rate = 9.0
        elif risk_score >= 650:
            interest_rate = 10.5
        elif risk_score >= 600:
            interest_rate = 12.0
        else:
            interest_rate = 14.5
        
        # 8. Determine risk category
        if risk_score >= 750:
            risk_category = 'LOW'
        elif risk_score >= 650:
            risk_category = 'MEDIUM'
        else:
            risk_category = 'HIGH'
        
        return {
            'approval_probability': probability,
            'risk_score': risk_score,
            'risk_category': risk_category,
            'decision': decision,
            'recommended_interest_rate': interest_rate,
            'simulated_cibil': transaction_data['simulated_cibil'],
            'transaction_analysis': transaction_data,
            'fraud_detection': fraud_result
        }
    
    def get_default_transaction_analysis(self):
        """Default values when no transaction data available"""
        return {
            'simulated_cibil': 650,
            'salary_count': 0,
            'savings_rate': 0.0,
            'fraud_count': 0,
            'avg_balance': 0.0,
            'cash_dependency': 0.0
        }

# ═══════════════════════════════════════════════════════════════════
# INITIALIZE SERVICE
# ═══════════════════════════════════════════════════════════════════

ml_service = LoanMLService()

# ═══════════════════════════════════════════════════════════════════
# API ENDPOINTS
# ═══════════════════════════════════════════════════════════════════

@app.route('/predict', methods=['POST'])
def predict():
    """Main prediction endpoint"""
    try:
        features = request.json
        result = ml_service.predict(features)
        return jsonify(result)
    except Exception as e:
        print(f"[ERROR] Prediction error: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/health', methods=['GET'])
def health():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'model': 'XGBoost',
        'database': 'PostgreSQL (loan_system)',
        'features': [
            'Transaction Analysis',
            'Simulated CIBIL',
            'Fraud Detection (9 patterns)',
            'Young Borrower Support'
        ]
    })

@app.route('/retrain', methods=['POST'])
def retrain():
    """Retrain model from database"""
    try:
        ml_service.train_from_database()
        return jsonify({'success': True, 'message': 'Model retrained successfully'})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

# ═══════════════════════════════════════════════════════════════════
# MAIN
# ═══════════════════════════════════════════════════════════════════

if __name__ == '__main__':
    print("===================================================")
    print(">> LoanAI ML Service Starting...")
    print("===================================================")
    print("Database: PostgreSQL (loan_system)")
    print("Host: localhost:5432")
    print("Features:")
    print("  - XGBoost ML Model")
    print("  - Transaction Analysis (1.2M records)")
    print("  - Simulated CIBIL Generation")
    print("  - 9-Pattern Fraud Detection")
    print("  - Young Borrower Support")
    print("===================================================")
    print(">> Running on http://localhost:5000")
    print("===================================================")
    
    app.run(host='0.0.0.0', port=5000, debug=True)
