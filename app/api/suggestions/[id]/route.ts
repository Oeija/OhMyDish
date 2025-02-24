import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const id = parseInt(params.id);
  if (isNaN(id)) {
    return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
  }

  try {
    const suggestion = await prisma.suggestion.findUnique({ where: { id } });
    if (!suggestion) {
      return NextResponse.json({ error: "Suggestion not found" }, { status: 404 });
    }
    return NextResponse.json(suggestion);
  } catch (error) {
    console.error("Error fetching suggestion:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const id = parseInt(params.id);
  if (isNaN(id)) {
    return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
  }

  try {
    await prisma.suggestion.delete({ where: { id } });
    return NextResponse.json({ message: "Suggestion deleted" });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete suggestion" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const id = parseInt(params.id);
  if (isNaN(id)) {
    return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
  }

  try {
    const { name, description } = await req.json();
    const updatedSuggestion = await prisma.suggestion.update({
      where: { id },
      data: { name, description },
    });
    return NextResponse.json(updatedSuggestion);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update suggestion" }, { status: 500 });
  }
}
