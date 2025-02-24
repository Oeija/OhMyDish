import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
    try {
        const suggestions = await prisma.suggestion.findMany({
        orderBy: { createdAt: "desc" },
        });
        return NextResponse.json(suggestions);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch suggestions" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
      const { name, description } = await req.json();
      const newSuggestion = await prisma.suggestion.create({
        data: { name, description },
      });
      return NextResponse.json(newSuggestion);
    } catch (error) {
      return NextResponse.json({ error: "Failed to create suggestion" }, { status: 500 });
    }
}

export async function DELETE(req: Request) {
    try {
      const { id } = await req.json();
      await prisma.suggestion.delete({ where: { id } });
      return NextResponse.json({ message: "Suggestion deleted" });
    } catch (error) {
      return NextResponse.json({ error: "Failed to delete suggestion" }, { status: 500 });
    }
}