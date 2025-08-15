import sib_api_v3_sdk
from sib_api_v3_sdk.rest import ApiException
import os
from dotenv import load_dotenv


load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), ".env"))
print("BREVO_API_KEY loaded:", os.getenv("BREVO_API_KEY")[:5], "...")


# Configure Brevo
configuration = sib_api_v3_sdk.Configuration()
configuration.api_key['api-key'] = os.getenv("BREVO_API_KEY")
api_instance = sib_api_v3_sdk.TransactionalEmailsApi(sib_api_v3_sdk.ApiClient(configuration))

def send_email(to_email, subject, html_content):
    sender = {"name": "A.R.C. Support", "email": "runesmedhaugen@gmail.com"}
    to = [{"email": to_email}]

    email = sib_api_v3_sdk.SendSmtpEmail(
        to=to,
        sender=sender,
        subject=subject,
        html_content=html_content
    )

    try:
        response = api_instance.send_transac_email(email)
        print(f"✅ Email sent to {to_email}. ID: {response.message_id}")
        return True
    except ApiException as e:
        print(f"❌ Error sending email: {e}")
        return False
