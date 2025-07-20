"use client";
import { use } from "react";
import useSWR from "swr";
import SingleElimination from "../components/SingleElimination";
import { TournamentResponse } from "../types/tournament";
import DoubleElimination from "../components/DoubleElimination";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

const BracketPage = ({ params }: { params: Promise<{ slug: string }> }) => {
  const { slug } = use(params);
  const { data, error, isLoading } = useSWR<TournamentResponse>(
    `/api/challonge/${slug}`,
    fetcher,
  );

  if (isLoading) return "sabar";
  if (error) return "error";
  if (!data) return "no data";

  if (data.tournament.tournament_type == "single elimination") {
    return <SingleElimination data={data} />;
  } else if (data.tournament.tournament_type == "double elimination") {
    return <DoubleElimination data={data} />
  }
};

export default BracketPage;
