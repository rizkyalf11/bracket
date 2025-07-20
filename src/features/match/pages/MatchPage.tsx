'use client'
import React, { use, useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Play, Trophy, Clock, Users, ArrowRight } from 'lucide-react'
import useSWR from 'swr'
import BracketWrapper from '../components/BracketWrapper'

const fetcher = (url) => fetch(url).then((r) => r.json())
interface ParticipantStats {
	id: number
	name: string
	wins: number
	losses: number
	ties: number
	setWins: number
	setTies: number
	points: number
}

const MatchPage = ({ params }: { params: Promise<{ slug: string }> }) => {
	const { slug } = use(params)
	const { data: participantsData, error, isLoading: isLoadingParticipants } = useSWR(`/api/challonge/${slug}`, fetcher)

	const tournamentId = 'demo-tournament-123' // Example tournament ID for demo
	const [tournamentState, setTournamentState] = useState('setup') // setup, ongoing, completed
	const [selectedMatch, setSelectedMatch] = useState(null)

	const [matches, setMatches] = useState([
		// Quarter Finals
		{ id: 1, round: 'Quarter Finals', player1: 'Team Alpha', player2: 'Team Hotel', status: 'pending', score1: '', score2: '', winner: null },
		{ id: 2, round: 'Quarter Finals', player1: 'Team Beta', player2: 'Team Golf', status: 'pending', score1: '', score2: '', winner: null },
		{ id: 3, round: 'Quarter Finals', player1: 'Team Gamma', player2: 'Team Foxtrot', status: 'pending', score1: '', score2: '', winner: null },
		{ id: 4, round: 'Quarter Finals', player1: 'Team Delta', player2: 'Team Echo', status: 'pending', score1: '', score2: '', winner: null },
		// Semi Finals
		{ id: 5, round: 'Semi Finals', player1: 'Winner QF1', player2: 'Winner QF2', status: 'waiting', score1: '', score2: '', winner: null },
		{ id: 6, round: 'Semi Finals', player1: 'Winner QF3', player2: 'Winner QF4', status: 'waiting', score1: '', score2: '', winner: null },
		// Final
		{ id: 7, round: 'Final', player1: 'Winner SF1', player2: 'Winner SF2', status: 'waiting', score1: '', score2: '', winner: null },
	])

	const getStatusColor = (status) => {
		switch (status) {
			case 'pending':
				return 'bg-yellow-100 text-yellow-800'
			case 'ongoing':
				return 'bg-blue-100 text-blue-800'
			case 'completed':
				return 'bg-green-100 text-green-800'
			case 'waiting':
				return 'bg-gray-100 text-gray-800'
			default:
				return 'bg-gray-100 text-gray-800'
		}
	}

	const startMatch = (matchId) => {
		// API Call: PUT /tournaments/{tournament_id}/matches/{match_id}.json
		// Body: { match: { state: "open" } }
		setMatches(matches.map((match) => (match.id === matchId ? { ...match, status: 'ongoing' } : match)))
		console.log(`API Call: Start match ${matchId} - PUT /tournaments/${tournamentId}/matches/${matchId}.json`)
	}

	const updateMatchScore = (matchId, score1, score2) => {
		// API Call: PUT /tournaments/{tournament_id}/matches/{match_id}.json
		// Body: { match: { scores_csv: "score1-score2" } }
		setMatches(matches.map((match) => (match.id === matchId ? { ...match, score1, score2 } : match)))
		console.log(`API Call: Update match ${matchId} scores - PUT /tournaments/${tournamentId}/matches/${matchId}.json`)
	}

	const setWinner = (matchId, winner) => {
		// API Call: PUT /tournaments/{tournament_id}/matches/{match_id}.json
		// Body: { match: { winner_id: participant_id } }
		setMatches(matches.map((match) => (match.id === matchId ? { ...match, winner, status: 'completed' } : match)))
		console.log(`API Call: Set winner for match ${matchId} - PUT /tournaments/${tournamentId}/matches/${matchId}.json`)
	}

	const startTournament = () => {
		// API Call: POST /tournaments/{tournament_id}/start.json
		setTournamentState('ongoing')
		console.log(`API Call: Start tournament - POST /tournaments/${tournamentId}/start.json`)
	}

	useEffect(() => {
		// console.log(participantsData?.data.tournament.participants)
	}, [participantsData])

	if (isLoadingParticipants) {
		return <p>sabar...</p>
	}

	const stats: Record<number, ParticipantStats> = {}

	// Initialize stats
	participantsData.data.tournament.participants.forEach((p) => {
		stats[p.participant.id] = {
			id: p.participant.id,
			name: p.participant.name,
			wins: 0,
			losses: 0,
			ties: 0,
			setWins: 0,
			setTies: 0,
			points: 0,
		}
	})

	// Process matches
	participantsData.data.tournament.matches.forEach((match) => {
		if (match.match.state !== 'complete') return

		const { player1_id, player2_id, winner_id, scores_csv } = match.match

		const player1 = stats[player1_id]
		const player2 = stats[player2_id]

		if (!winner_id) {
			player1.ties++
			player2.ties++
			// player1.points++
			// player2.points++
			player1.setTies++
			player2.setTies++
		} else {
			const loser_id = player1_id === winner_id ? player2_id : player1_id
			stats[winner_id].wins++
			stats[loser_id].losses++

			if (scores_csv) {
				const scores_csv_array = scores_csv.split(',')
				for (let i = 0; i < scores_csv_array.length; i++) {
					const [s1, s2] = scores_csv_array[i].split('-').map(Number)
					// console.log(s1, s2)
					console.log(`${s1} - ${s2}\n${player1.name}, ${player2.name}`)
					if (!isNaN(s1) && !isNaN(s2)) {
						stats[player1_id].points += s1
						stats[player2_id].points += s2
					}

					if (s1 != s2) {
						if (s1 > s2) {
							player1.setWins += 1
						} else {
							player2.setWins += 1
						}
					}
				}
			} else {
				stats[winner_id].setWins += 1
			}
		}
	})

	let standings = Object.values(stats).sort((a, b) => b.wins - a.wins)
	standings = Object.values(stats).sort((a, b) => b.points - a.points)

	return (
		<div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-4">
			<div className="max-w-7xl mx-auto">
				{/* Header */}
				<div className="mb-8">
					<h1 className="text-4xl font-bold text-gray-900 mb-2">Tournament Manager</h1>
					<p className="text-gray-600">Manage your Challonge tournament matches and determine winners</p>
				</div>

				{/* Tournament Status */}
				<Card className="mb-6">
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<Trophy className="w-5 h-5" />
							Tournament Status
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="flex items-center justify-between">
							<div className="flex items-center gap-4">
								<Badge variant="outline" className="text-lg px-4 py-2">
									{tournamentState === 'setup' && 'Setup Phase'}
									{tournamentState === 'ongoing' && 'Tournament Ongoing'}
									{tournamentState === 'completed' && 'Tournament Completed'}
								</Badge>
								<div className="flex items-center gap-2 text-sm text-gray-600">
									<Users className="w-4 h-4" />
									{participantsData.data.tournament.participants.length} Participants
								</div>
							</div>
							{tournamentState === 'setup' && (
								<Button onClick={startTournament} className="flex items-center gap-2">
									<Play className="w-4 h-4" />
									Start Tournament
								</Button>
							)}
						</div>
					</CardContent>
				</Card>

				{/* Participants Section */}
				<Card className="mb-6">
					<CardHeader>
						<CardTitle>Participants</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="grid grid-cols-2 md:grid-cols-4 gap-3">
							{participantsData.data.tournament.participants.map((item) => (
								<div key={item.participant.id} className="bg-white p-3 rounded-lg border border-gray-200 text-center">
									<div className="font-semibold text-gray-900">{item.participant.display_name_with_invitation_email_address}</div>
									<div className="text-sm text-gray-500">SEED #{item.participant.seed}</div>
								</div>
							))}
						</div>
					</CardContent>
				</Card>

				<Card className="mb-6">
					<CardHeader>
						<CardTitle>Bracket</CardTitle>
					</CardHeader>
					<CardContent>
						<BracketWrapper url={slug} height={800} />
					</CardContent>
				</Card>

				<div className="p-6">
					<h1 className="text-2xl font-bold mb-4">Standings</h1>
					<table className="table-auto w-full border">
						<thead>
							<tr className="bg-gray-100">
								<th className="border px-2 py-1">Rank</th>
								<th className="border px-2 py-1">Participant</th>
								<th className="border px-2 py-1">Match W-L-T</th>
								<th className="border px-2 py-1">Set Wins</th>
								<th className="border px-2 py-1">Set Ties</th>
								<th className="border px-2 py-1">Pts</th>
							</tr>
						</thead>
						<tbody>
							{standings.map((team, i) => (
								<tr key={team.id} className="text-center">
									<td className="border px-2 py-1">{i + 1}</td>
									<td className="border px-2 py-1">{team.name}</td>
									<td className="border px-2 py-1">
										{team.wins}-{team.losses}-{team.ties}
									</td>
									<td className="border px-2 py-1">{team.setWins}</td>
									<td className="border px-2 py-1">{team.setTies}</td>
									<td className="border px-2 py-1">{team.points}</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>

				{/* Matches Section */}
				<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
					{/* Quarter Finals */}
					<Card>
						<CardHeader>
							<CardTitle className="text-lg">Quarter Finals</CardTitle>
						</CardHeader>
						<CardContent className="space-y-4">
							{matches
								.filter((match) => match.round === 'Quarter Finals')
								.map((match) => (
									<div key={match.id} className="bg-white p-4 rounded-lg border border-gray-200">
										<div className="flex items-center justify-between mb-3">
											<Badge className={getStatusColor(match.status)}>{match.status}</Badge>
											<div className="text-sm text-gray-500">Match {match.id}</div>
										</div>

										<div className="space-y-2 mb-3">
											<div className="flex items-center justify-between">
												<span className="font-medium">{match.player1}</span>
												<Input type="number" placeholder="Score" className="w-16 h-8 text-center" value={match.score1} onChange={(e) => updateMatchScore(match.id, e.target.value, match.score2)} />
											</div>
											<div className="flex items-center justify-center">
												<span className="text-gray-400">VS</span>
											</div>
											<div className="flex items-center justify-between">
												<span className="font-medium">{match.player2}</span>
												<Input type="number" placeholder="Score" className="w-16 h-8 text-center" value={match.score2} onChange={(e) => updateMatchScore(match.id, match.score1, e.target.value)} />
											</div>
										</div>

										<div className="flex gap-2">
											{match.status === 'pending' && (
												<Button size="sm" onClick={() => startMatch(match.id)} className="flex-1">
													<Play className="w-3 h-3 mr-1" />
													Start
												</Button>
											)}
											{match.status === 'ongoing' && (
												<Select onValueChange={(value) => setWinner(match.id, value)}>
													<SelectTrigger className="flex-1">
														<SelectValue placeholder="Set Winner" />
													</SelectTrigger>
													<SelectContent>
														<SelectItem value={match.player1}>{match.player1}</SelectItem>
														<SelectItem value={match.player2}>{match.player2}</SelectItem>
													</SelectContent>
												</Select>
											)}
											{match.status === 'completed' && (
												<div className="flex-1 text-center">
													<Badge variant="outline" className="text-green-600">
														Winner: {match.winner}
													</Badge>
												</div>
											)}
										</div>
									</div>
								))}
						</CardContent>
					</Card>

					{/* Semi Finals */}
					<Card>
						<CardHeader>
							<CardTitle className="text-lg">Semi Finals</CardTitle>
						</CardHeader>
						<CardContent className="space-y-4">
							{matches
								.filter((match) => match.round === 'Semi Finals')
								.map((match) => (
									<div key={match.id} className="bg-white p-4 rounded-lg border border-gray-200">
										<div className="flex items-center justify-between mb-3">
											<Badge className={getStatusColor(match.status)}>{match.status}</Badge>
											<div className="text-sm text-gray-500">Match {match.id}</div>
										</div>

										<div className="space-y-2 mb-3">
											<div className="flex items-center justify-between">
												<span className="font-medium text-gray-500">{match.player1}</span>
												<Input type="number" placeholder="Score" className="w-16 h-8 text-center" disabled={match.status === 'waiting'} />
											</div>
											<div className="flex items-center justify-center">
												<span className="text-gray-400">VS</span>
											</div>
											<div className="flex items-center justify-between">
												<span className="font-medium text-gray-500">{match.player2}</span>
												<Input type="number" placeholder="Score" className="w-16 h-8 text-center" disabled={match.status === 'waiting'} />
											</div>
										</div>

										<Button size="sm" disabled={match.status === 'waiting'} className="w-full" variant={match.status === 'waiting' ? 'secondary' : 'default'}>
											{match.status === 'waiting' ? (
												<>
													<Clock className="w-3 h-3 mr-1" />
													Waiting for QF
												</>
											) : (
												<>
													<Play className="w-3 h-3 mr-1" />
													Start
												</>
											)}
										</Button>
									</div>
								))}
						</CardContent>
					</Card>

					{/* Final */}
					<Card>
						<CardHeader>
							<CardTitle className="text-lg">Final</CardTitle>
						</CardHeader>
						<CardContent>
							{matches
								.filter((match) => match.round === 'Final')
								.map((match) => (
									<div key={match.id} className="bg-gradient-to-r from-yellow-50 to-orange-50 p-4 rounded-lg border-2 border-yellow-200">
										<div className="flex items-center justify-between mb-3">
											<Badge className={`${getStatusColor(match.status)} border-yellow-300`}>{match.status}</Badge>
											<div className="text-sm text-gray-500 flex items-center gap-1">
												<Trophy className="w-4 h-4" />
												Championship
											</div>
										</div>

										<div className="space-y-2 mb-3">
											<div className="flex items-center justify-between">
												<span className="font-medium text-gray-500">{match.player1}</span>
												<Input type="number" placeholder="Score" className="w-16 h-8 text-center" disabled={match.status === 'waiting'} />
											</div>
											<div className="flex items-center justify-center">
												<span className="text-gray-400">VS</span>
											</div>
											<div className="flex items-center justify-between">
												<span className="font-medium text-gray-500">{match.player2}</span>
												<Input type="number" placeholder="Score" className="w-16 h-8 text-center" disabled={match.status === 'waiting'} />
											</div>
										</div>

										<Button
											size="sm"
											disabled={match.status === 'waiting'}
											className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600"
											variant={match.status === 'waiting' ? 'secondary' : 'default'}
										>
											{match.status === 'waiting' ? (
												<>
													<Clock className="w-3 h-3 mr-1" />
													Waiting for SF
												</>
											) : (
												<>
													<Trophy className="w-3 h-3 mr-1" />
													Start Final
												</>
											)}
										</Button>
									</div>
								))}
						</CardContent>
					</Card>
				</div>

				{/* Tournament Bracket Flow */}
				<Card className="mt-6">
					<CardHeader>
						<CardTitle>Tournament Flow</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="flex items-center justify-center space-x-4 text-sm">
							<div className="text-center">
								<div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-2">
									<Users className="w-8 h-8 text-blue-600" />
								</div>
								<div className="font-medium">8 Teams</div>
								<div className="text-gray-500">Quarter Finals</div>
							</div>
							<ArrowRight className="w-5 h-5 text-gray-400" />
							<div className="text-center">
								<div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-2">
									<Users className="w-8 h-8 text-green-600" />
								</div>
								<div className="font-medium">4 Teams</div>
								<div className="text-gray-500">Semi Finals</div>
							</div>
							<ArrowRight className="w-5 h-5 text-gray-400" />
							<div className="text-center">
								<div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mb-2">
									<Trophy className="w-8 h-8 text-yellow-600" />
								</div>
								<div className="font-medium">2 Teams</div>
								<div className="text-gray-500">Final</div>
							</div>
							<ArrowRight className="w-5 h-5 text-gray-400" />
							<div className="text-center">
								<div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-2">
									<Trophy className="w-8 h-8 text-purple-600" />
								</div>
								<div className="font-medium">1 Winner</div>
								<div className="text-gray-500">Champion</div>
							</div>
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	)
}

export default MatchPage
