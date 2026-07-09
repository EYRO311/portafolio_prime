import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { z } from "zod";

const ContactSchema = z.object({
  name: z.string().min(2).max(80),
  email: z.string().email().max(120),
  message: z.string().min(10).max(2000),
});

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = ContactSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, message: "Datos inválidos", issues: parsed.error.issues },
      { status: 400 }
    );
  }

  const { name, email, message } = parsed.data;

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const to = process.env.MAIL_TO;
  const from = process.env.MAIL_FROM || process.env.SMTP_USER;

  try {
    await transporter.sendMail({
      from,
      to,
      subject: `Nuevo mensaje de portafolio: ${name}`,
      replyTo: email,
      text: `Nombre: ${name}\nEmail: ${email}\n\nMensaje:\n${message}`,
    });
  } catch (err) {
    console.error("Error enviando correo de contacto:", err);
    return NextResponse.json(
      { ok: false, message: "No se pudo enviar el mensaje" },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true, message: "Mensaje enviado" });
}
