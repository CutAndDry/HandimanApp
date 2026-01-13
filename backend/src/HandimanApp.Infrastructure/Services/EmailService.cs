using System;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;
using System.Net;
using System.Net.Mail;

namespace HandimanApp.Infrastructure.Services
{
    public interface IEmailService
    {
        Task SendInvoiceAsync(string recipientEmail, string recipientName, string invoiceNumber, decimal totalAmount);
        Task SendAsync(string to, string subject, string body);
    }

    public class EmailService : IEmailService
    {
        private readonly IConfiguration _configuration;

        public EmailService(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public async Task SendInvoiceAsync(string recipientEmail, string recipientName, string invoiceNumber, decimal totalAmount)
        {
            var subject = $"Invoice {invoiceNumber} from HandimanApp";
            var body = $@"
Hello {recipientName},

Thank you for your business. Please find your invoice details below:

Invoice Number: {invoiceNumber}
Total Amount: ${totalAmount:F2}

Please reply to this email if you have any questions.

Best regards,
HandimanApp
";
            await SendAsync(recipientEmail, subject, body);
        }

        public async Task SendAsync(string to, string subject, string body)
        {
            try
            {
                var smtpHost = _configuration["Email:SmtpHost"] ?? "localhost";
                var smtpPort = int.Parse(_configuration["Email:SmtpPort"] ?? "587");
                var smtpUsername = _configuration["Email:SmtpUsername"] ?? "";
                var smtpPassword = _configuration["Email:SmtpPassword"] ?? "";
                var fromAddress = _configuration["Email:FromAddress"] ?? "noreply@handimanapp.com";
                var fromName = _configuration["Email:FromName"] ?? "HandimanApp";

                using (var client = new SmtpClient(smtpHost, smtpPort))
                {
                    client.EnableSsl = true;
                    if (!string.IsNullOrEmpty(smtpUsername))
                    {
                        client.Credentials = new NetworkCredential(smtpUsername, smtpPassword);
                    }

                    var mailMessage = new MailMessage(
                        new MailAddress(fromAddress, fromName),
                        new MailAddress(to)
                    )
                    {
                        Subject = subject,
                        Body = body,
                        IsBodyHtml = false
                    };

                    await client.SendMailAsync(mailMessage);
                }
            }
            catch (Exception ex)
            {
                // Log error but don't throw - email failure shouldn't break the app
                Console.WriteLine($"Error sending email: {ex.Message}");
            }
        }
    }
}
