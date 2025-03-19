import uvicorn
import os

if __name__ == "__main__":

    reload = os.environ.get("ENVIRONMENT") != "production"
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=reload)
