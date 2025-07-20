import React, { useState } from "react";
import { useBracket } from "../hooks/use-bracket";
import { Match, TournamentResponse } from "../types/tournament";
import MatchCard from "./MatchCard";

const SingleElimination = ({ data }: { data: TournamentResponse }) => {
    const [hoveredParticipant, setHoveredParticipant] = useState<number | null>(
    null,
  );

    const {
    isLoading: isLoadingBracket,
    groupedMatches,
    roundChildCount,
    totalRows,
    participantWithKey,
  } = useBracket(
    data?.tournament.matches ?? [],
    data?.tournament.participants ?? [],
  );

  if(isLoadingBracket) {
    return 'load'
  }

  return (
    <div className="flex gap-8 overflow-x-auto p-5">
      {Object.keys(groupedMatches)
        .sort()
        .map((round, roundIdx, arr) => {
          const isSecondLast =
            roundIdx === Object.keys(roundChildCount).length - 2;
          const isLast = roundIdx === Object.keys(roundChildCount).length - 1;

          let label = `Round ${round}`;
          if (isLast) label = "Final";
          else if (isSecondLast) label = "SemiFinal";

          return (
            <div key={round} className="flex flex-col">
              <div className="bg-card border-border flex min-w-[280px] items-center justify-center rounded-sm border-2 py-3 font-semibold">
                {label}
              </div>

              <div
                style={{
                  gridTemplateRows: `grid-template-rows: repeat(${totalRows}, minmax(0, 1fr))`,
                  height: `${64 * totalRows + 8 * totalRows}px`,
                }}
                className={`grid grid-cols-1 gap-y-2`}
              >
                {groupedMatches[round].map((match: Match, idx: number) => {
                  if (match.isHidden) {
                    return <div key={idx} className="h-[64px]" />;
                  } else {
                    return (
                      <MatchCard
                        match={match}
                        isLineUp={(idx + 1) % 2}
                        hasRightConnector={roundIdx < arr.length - 1}
                        roundChildCount={roundChildCount}
                        totalRows={totalRows}
                        key={match.id}
                        participant={participantWithKey}
                        hoveredParticipant={hoveredParticipant}
                        onParticipantHover={setHoveredParticipant}
                      />
                    );
                  }
                })}
              </div>
            </div>
          );
        })}
    </div>
  );
};

export default SingleElimination;
