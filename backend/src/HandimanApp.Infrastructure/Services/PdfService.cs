using System;
using System.IO;
using System.Text;
using HandimanApp.Core.Entities;

namespace HandimanApp.Infrastructure.Services
{
    public interface IPdfService
    {
        byte[] GenerateInvoicePdf(Invoice invoice);
    }

    public class PdfService : IPdfService
    {
        public byte[] GenerateInvoicePdf(Invoice invoice)
        {
            // Simple PDF generation using iText7
            // For now, return a basic text-based "PDF"
            // In production, you'd use iText7 or similar library
            
            var sb = new StringBuilder();
            sb.AppendLine("=====================================");
            sb.AppendLine("INVOICE");
            sb.AppendLine("=====================================");
            sb.AppendLine($"Invoice #: {invoice.InvoiceNumber}");
            sb.AppendLine($"Date: {invoice.InvoiceDate:yyyy-MM-dd}");
            sb.AppendLine($"Due Date: {invoice.DueDate:yyyy-MM-dd}");
            sb.AppendLine("");
            sb.AppendLine("SUMMARY");
            sb.AppendLine("=====================================");
            sb.AppendLine($"Labor Hours: {invoice.LaborHours}");
            sb.AppendLine($"Hourly Rate: ${invoice.HourlyRate:F2}");
            sb.AppendLine($"Labor Amount: ${invoice.LaborAmount:F2}");
            sb.AppendLine($"Material Cost: ${invoice.MaterialCost:F2}");
            sb.AppendLine($"Subtotal: ${invoice.Subtotal:F2}");
            sb.AppendLine($"Tax ({invoice.TaxRate * 100:F1}%): ${invoice.TaxAmount:F2}");
            sb.AppendLine($"TOTAL: ${invoice.TotalAmount:F2}");
            sb.AppendLine("");
            sb.AppendLine($"Paid Amount: ${invoice.PaidAmount:F2}");
            sb.AppendLine($"Status: {invoice.Status}");
            sb.AppendLine("=====================================");
            
            return Encoding.UTF8.GetBytes(sb.ToString());
        }
    }
}
