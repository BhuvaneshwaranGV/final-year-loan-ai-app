import psycopg2
import json

conn = psycopg2.connect(
    host="localhost",
    database="loan_system",
    user="postgres",
    password="gvB@2004"
)

cur = conn.cursor()
cur.execute("SELECT fraud_type, COUNT(*) FROM transaction_history WHERE account_number = '9112520259395055' AND fraud_flag = 1 GROUP BY fraud_type")
fraud_details = cur.fetchall()

cur.execute("SELECT SUM(debit_amount) as total_debit, AVG(balance_after) as avg_bal FROM transaction_history WHERE account_number = '9112520259395055'")
financial_stats = cur.fetchone()

# Get detailed customer info for this account
cur.execute("SELECT c.cif_number, c.full_name, c.email, c.age, c.employment_type, c.monthly_income_declared FROM customer_master c JOIN account_master a ON c.cif_number = a.cif_number WHERE a.account_number = '9112520259395055'")
customer_info = cur.fetchone()

cur.close()
conn.close()

if customer_info:
    print(json.dumps({
        "accountNumber": "9112520259395055",
        "cifNumber": customer_info[0],
        "applicantName": customer_info[1],
        "email": customer_info[2],
        "age": customer_info[3],
        "employmentType": customer_info[4],
        "monthlyIncome": float(customer_info[5]) if customer_info[5] else 0,
        "fraud_patterns": {row[0]: row[1] for row in fraud_details}
    }))
else:
    print(json.dumps({"error": "Customer not found for this account"}))
