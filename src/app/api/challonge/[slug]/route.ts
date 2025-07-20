export async function GET(request: Request, { params }: { params: Promise<{ slug: string }> }) {
	const { slug } = await params;
	console.log('nih', slug)
	const res = await fetch(`https://api.challonge.com/v1/tournaments/${slug}.json?api_key=YrnFsorwbrzz8K7e0AboImhPMoUugL5MIw5AEDKO&include_participants=1&include_matches=1`)
	const data = await res.json()

	return Response.json({ tournament: data.tournament })
}
