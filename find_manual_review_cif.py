import psycopg2
from psycopg2.extras import RealDictCursor
import numpy as np

DB_CONFIG = {
    'host': 'localhost',
    'port': 5432,
    'database': 'loan_system',
    'user': 'postgres',
    'password': 'gvB@2004'
}

def get_connection():
    return psycopg2.connect(**DB_CONFIG)

def calculate_simulated_cibil(salary_count, savings_rate, fraud_count, avg_balance, cash_dependency):
    base_score = 650
    if salary_count >= 6: base_score += 50
    elif salary_count >= 3: base_score += 25
    if savings_rate > 0.20: base_score += 50
    elif savings_rate > 0.10: base_score += 25
    elif savings_rate < 0: base_score -= 30
    if fraud_count > 0: base_score -= 100
    if avg_balance > 50000: base_score += 30
    elif avg_balance > 25000: base_score += 15
    elif avg_balance < 5000: base_score -= 20
    if cash_dependency > 0.30: base_score -= 40
    elif cash_dependency > 0.20: base_score -= 20
    return max(300, min(850, base_score))

def find_cif():
    conn = get_connection()
    cursor = conn.cursor(cursor_factory=RealDictCursor)
    
    # Check details for CIF100001
    cif = 'CIF100001'
    cursor.execute("SELECT * FROM customer_master WHERE cif_number = %s", (cif,))
    customer = cursor.fetchone()
    print(f"Details for {cif}: {customer}")
    
    # Get accounts
    cursor.execute("SELECT account_number FROM account_master WHERE cif_number = %s", (cif,))
    accounts = [row['account_number'] for row in cursor.fetchall()]
    print(f"Accounts for {cif}: {accounts}")

    cursor.close()
    conn.close()

    cursor.close()
    conn.close()

if __name__ == "__main__":
    find_cif()
