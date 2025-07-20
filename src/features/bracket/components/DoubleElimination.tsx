import { useState } from "react";
import { useBracketDouble } from "../hooks/use-bracket-double";
import { Match, TournamentResponse } from "../types/tournament";
import MatchCard from "./MatchCard";

const DoubleElimination = ({ data }: { data: TournamentResponse }) => {
  const [hoveredParticipant, setHoveredParticipant] = useState<number | null>(
    null,
  );

  const {
    isLoading: isLoadingBracket,
    groupedMatchesUpper,
    roundChildCount,
    totalRows,
    participantWithKey,
  } = useBracketDouble(
    data?.tournament.matches ?? [],
    data?.tournament.participants ?? [],
  );

  if (isLoadingBracket) {
    return "load";
  }

  console.log(roundChildCount);

  return (
    <div className="flex gap-8 overflow-x-auto p-5">
      {Object.keys(groupedMatchesUpper)
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
              {groupedMatchesUpper[round][0].isCollapse == null ? (
                <div className="bg-card border-border flex min-w-[280px] items-center justify-center rounded-sm border-2 py-3 font-semibold">
                  {label}
                </div>
              ) : (
                <div className="bg-card border-border flex h-[52px] min-w-[280px] items-center justify-center rounded-sm border-2 py-3 font-semibold opacity-0"></div>
              )}

              <div
                style={{
                  gridTemplateRows: `grid-template-rows: repeat(${totalRows}, minmax(0, 1fr))`,
                  height: `${64 * totalRows + 8 * totalRows}px`,
                }}
                className={`grid grid-cols-1 gap-y-2`}
              >
                {groupedMatchesUpper[round].map((match: Match, idx: number) => {
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

export default DoubleElimination;
