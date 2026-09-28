import { NextResponse } from "next/server";
import { getPublishedTrips } from "@/lib/trips";

export const dynamic = "force-dynamic";

export async function GET(){
  const trips=await getPublishedTrips(false);
  return NextResponse.json(trips.map(t=>({
    slug:t.slug,title:t.title,destination:t.destination,duration:t.duration,lead:t.lead,price:t.price,image:t.heroImage,status:t.status,spots:t.spots
  })));
}
