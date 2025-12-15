import os
import smtplib
import ssl
from email.message import EmailMessage
from email.utils import formataddr
SMTP_HOST = os.getenv("SMTP_HOST")
SMTP_PORT = int(os.getenv("SMTP_PORT", "587"))
SMTP_USER = os.getenv("SMTP_USER")
SMTP_PASSWORD = os.getenv("SMTP_PASSWORD")
EMAIL_FROM = os.getenv("EMAIL_FROM", SMTP_USER)
APP_BASE_URL = os.getenv("APP_BASE_URL", "http://localhost:8000")

def send_verification_email(to_email: str, token: str):
    
    verification_link = f"{APP_BASE_URL}/auth/verify-email?token={token}"

    if not (SMTP_USER and SMTP_PASSWORD and SMTP_HOST and SMTP_PORT):
        print("⚠️ SMTP ayarları eksik! Mail gönderilmedi.")
        print("Doğrulama Linki:", verification_link)
        return

    msg = EmailMessage()
    msg["Subject"] = "CityFlow - E-posta Doğrulama"
    msg["From"] = EMAIL_FROM
    msg["To"] = to_email

    
    msg.set_content(
        f"Merhaba!\n\n"
        f"CityFlow hesabını aktifleştirmek için aşağıdaki bağlantıya tıkla:\n"
        f"{verification_link}\n\n"
    )

   
    html_content = f"""
    <html>
      <body style="font-family: Arial, sans-serif; color: #333;">
        <div style="background-color: #f4f4f4; padding: 20px;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #fff; padding: 20px; border-radius: 8px;">
            <h2 style="color: #4F46E5;">CityFlow'a Hoş Geldin!</h2>
            <p>Hesabını doğrulamak için lütfen aşağıdaki butona tıkla:</p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="{verification_link}" style="background-color: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;">
                E-postamı Doğrula
              </a>
            </div>
            <p style="font-size: 12px; color: #888;">Eğer butona tıklayamıyorsan, şu linki tarayıcıya yapıştır: {verification_link}</p>
          </div>
        </div>
      </body>
    </html>
    """
    msg.add_alternative(html_content, subtype='html')

    context = ssl.create_default_context()
    with smtplib.SMTP(SMTP_HOST, SMTP_PORT) as server:
        server.starttls(context=context)
        server.login(SMTP_USER, SMTP_PASSWORD)
        server.send_message(msg)

    print(f"📧 Doğrulama maili gönderildi → {to_email}")


def send_password_reset_email(to_email: str, token: str):
    
    reset_link = f"{APP_BASE_URL}/auth/open-app?token={token}"

    if not (SMTP_USER and SMTP_PASSWORD and SMTP_HOST and SMTP_PORT):
        print("⚠️ SMTP ayarları eksik!")
        return

    msg = EmailMessage()
    msg["Subject"] = "CityFlow - Şifre Sıfırlama"
    
    
    msg["From"] = formataddr(("CityFlow", SMTP_USER))
    
    msg["To"] = to_email

   
    msg.set_content(
        f"Merhaba,\n\n"
        f"CityFlow şifrenizi sıfırlamak için lütfen aşağıdaki bağlantıdaki butonu kullanın.\n"
    )


    html_content = f"""
    <!DOCTYPE html>
    <html>
      <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
        <table role="presentation" style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 20px 0; text-align: center;">
              
              <div style="background-color: white; max-width: 600px; margin: 0 auto; padding: 40px; border-radius: 10px; box-shadow: 0 4px 10px rgba(0,0,0,0.05); text-align: center;">
                
                <h2 style="color: #4F46E5; margin-top: 0;">Şifre Sıfırlama</h2>
                
                <p style="color: #555; font-size: 16px; line-height: 1.6; margin-bottom: 30px;">
                  CityFlow hesabınızın şifresini sıfırlamak için<br>aşağıdaki butona tıklayın.
                </p>
                
                <a href="{reset_link}" style="display: inline-block; background-color: #4F46E5; color: white; padding: 16px 32px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 18px;">
                  Şifremi Sıfırla
                </a>

                <p style="color: #999; font-size: 12px; margin-top: 40px;">
                  Bu işlemi siz yapmadıysanız, bu e-postayı silebilirsiniz.
                </p>

              </div>
              
            </td>
          </tr>
        </table>
      </body>
    </html>
    """
    
    msg.add_alternative(html_content, subtype='html')

    context = ssl.create_default_context()
    try:
        with smtplib.SMTP(SMTP_HOST, SMTP_PORT) as server:
            server.starttls(context=context)
            server.login(SMTP_USER, SMTP_PASSWORD)
            server.send_message(msg)
        print(f"📧 Şifre sıfırlama maili gönderildi → {to_email}")
    except Exception as e:
        print(f"❌ Mail gönderme hatası: {e}")


def send_email_change_code(to_email: str, code: str):
    if not (SMTP_USER and SMTP_PASSWORD and SMTP_HOST and SMTP_PORT):
        print("⚠️ SMTP ayarları eksik! Mail gönderilmedi.")
        print("E-posta değişim kodu:", code)
        return

    msg = EmailMessage()
    msg["Subject"] = "CityFlow - E-posta Değiştirme Kodu"
    msg["From"] = EMAIL_FROM
    msg["To"] = to_email

    msg.set_content(
        f"Merhaba!\n\n"
        f"E-posta değişikliği için doğrulama kodunuz: {code}\n"
        f"Kod 10 dakika geçerlidir.\n\n"
        f"Bu işlem size ait değilse bu e-postayı dikkate almayın.\n"
    )

    html_content = f"""
    <html>
      <body style="font-family: Arial, sans-serif; color: #333;">
        <div style="background-color: #f4f4f4; padding: 20px;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #fff; padding: 20px; border-radius: 8px;">
            <h2 style="color: #4F46E5;">E-posta Değiştirme</h2>
            <p>E-posta değişikliğini onaylamak için doğrulama kodunuz:</p>
            <div style="text-align: center; margin: 24px 0;">
              <div style="display:inline-block; font-size: 28px; letter-spacing: 6px; font-weight: bold; padding: 12px 18px; border: 1px solid #ddd; border-radius: 8px;">
                {code}
              </div>
            </div>
            <p style="font-size: 12px; color: #888;">Kod 10 dakika geçerlidir.</p>
          </div>
        </div>
      </body>
    </html>
    """
    msg.add_alternative(html_content, subtype="html")

    context = ssl.create_default_context()
    with smtplib.SMTP(SMTP_HOST, SMTP_PORT) as server:
        server.starttls(context=context)
        server.login(SMTP_USER, SMTP_PASSWORD)
        server.send_message(msg)

    print(f"📧 E-posta değişim kodu gönderildi → {to_email}")
