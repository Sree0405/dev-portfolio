import * as projectRepo from "../repositories/projectRepository.js";
import * as paymentRepo from "../repositories/paymentRepository.js";
import * as noteRepo from "../repositories/noteRepository.js";
import { serializeProject, serializePayment, serializeNote } from "../lib/serializers.js";
import { parseProjectLinks } from "../lib/projectLinks.js";
import { generateInvoiceNumber } from "../invoice/invoiceNumber.js";
import { formatInvoiceDate, getPaymentStatus, sanitizeFilename } from "../invoice/format.js";
import { renderInvoicePdf } from "../invoice/template/renderInvoice.js";
import type { InvoiceData } from "../invoice/types.js";
import type { DataType } from "../auth/config.js";

export async function generateProjectInvoice(projectId: string, dataType: DataType) {
  const project = await projectRepo.getProjectById(projectId, dataType);
  if (!project) {
    throw new Error("NOT_FOUND");
  }

  const [payments, notes, invoiceNumber] = await Promise.all([
    paymentRepo.listPaymentsByProject(projectId, dataType),
    noteRepo.listNotesByProject(projectId, dataType),
    generateInvoiceNumber(projectId, dataType),
  ]);

  const serializedProject = serializeProject(project);
  const now = new Date();

  const invoiceData: InvoiceData = {
    invoiceNumber,
    invoiceDate: formatInvoiceDate(now),
    generatedDate: formatInvoiceDate(now),
    project: {
      name: serializedProject.name,
      clientName: serializedProject.clientName,
      clientNumber: serializedProject.clientNumber,
      projectLinks: parseProjectLinks(project.projectLinks),
      projectType: serializedProject.projectType,
      status: serializedProject.status,
      plannedAmount: serializedProject.plannedAmount,
      totalPaid: serializedProject.totalPaid,
      remainingAmount: serializedProject.remainingAmount,
      createdAt: serializedProject.createdAt,
      updatedAt: serializedProject.updatedAt,
    },
    payments: payments.map((payment) => {
      const serialized = serializePayment(payment);
      return {
        paymentDate: serialized.paymentDate,
        amount: serialized.amount,
        paymentMethod: serialized.paymentMethod,
        reference: serialized.reference,
        notes: serialized.notes,
      };
    }),
    notes: notes.map((note) => {
      const serialized = serializeNote(note);
      return {
        createdAt: serialized.createdAt,
        content: serialized.content,
      };
    }),
    paymentStatus: getPaymentStatus(serializedProject.remainingAmount),
  };

  const buffer = await renderInvoicePdf(invoiceData, dataType);
  const filename = `Invoice_${sanitizeFilename(project.name)}.pdf`;

  return { buffer, filename };
}
