SQLCMD -S (LocalDb)\MSSQLLocalDB -d Hotels.Database -Q "DELETE FROM Views WHERE ExpireTime< CURRENT_TIMESTAMP"
