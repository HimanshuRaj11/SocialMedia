import { InternalServerError } from "@/lib/handleError";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const cookiesObj = await cookies();
        cookiesObj.delete("cross_auth_token")
        return NextResponse.json({ message: "Logout successful", success: true }, { status: 200 })
    } catch (error) {
        return NextResponse.json(InternalServerError(error as Error))
    }
}