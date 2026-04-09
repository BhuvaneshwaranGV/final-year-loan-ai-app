import psycopg2
from psycopg2.extras import RealDictCursor

DB_CONFIG = {
    'host': 'localhost',
    'port': 5432,
    'database': 'loan_system',
    'user': 'postgres',
    'password': 'gvB@2004'
}

def verify_account(acc_num):
    conn = psycopg2.connect(**DB_CONFIG)
    cursor = conn.cursor(cursor_factory=RealDictCursor)
    
    print(f"Checking for Account: {acc_num}")
    cursor.execute("SELECT * FROM account_master WHERE account_number = %s", (acc_num,))
    result = cursor.fetchone()
    if result:
        print(f"FOUND: {result}")
    else:
        print("NOT FOUND")
        
    print("\nSearching for accounts belonging to Jessica Berry (CIF100001):")
    cursor.execute("SELECT account_number, cif_number FROM account_master WHERE cif_number = 'CIF100001'")
    results = cursor.fetchall()
    for row in results:
        print(f"Account: {row['account_number']} (CIF: {row['cif_number']})")

    cursor.close()
    conn.close()

if __name__ == "__main__":
    verify_account('3800774876697200')
