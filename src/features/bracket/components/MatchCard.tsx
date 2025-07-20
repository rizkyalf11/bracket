import { cn } from "@/lib/utils";
import { RotateCcw, SquarePen } from "lucide-react";
import { Match, Participant } from "../types/tournament";

type BracketMatchProps = {
  match: Match;
  roundChildCount: { [key: string]: number };
  totalRows: number;
  participant: { [key: number]: Participant };
  hasRightConnector: boolean;
  isLineUp: number;
  hoveredParticipant: number | null;
  onParticipantHover: (participantId: number | null) => void;
};

const MatchCard = ({
  match,
  roundChildCount,
  totalRows,
  participant,
  hasRightConnector,
  isLineUp,
  hoveredParticipant,
  onParticipantHover,
}: BracketMatchProps) => {
  const round = Object.keys(roundChildCount);
  let span = 0;
  round.filter((item) => {
    if (match.round === parseInt(item)) {
      span = totalRows / roundChildCount[item];
    }
  });
  const isUp = isLineUp == 0;
  const isFill =
    match.player1_prereq_match_id == null &&
    match.player2_prereq_match_id == null;
  const [player1, player2] = match.scores_csv!.split("-");

  const isParticipantHovered = (participantId: number | null | undefined) => {
    return participantId !== null && hoveredParticipant === participantId;
  };

  const isOnlyOneChild = span == totalRows

  return (
    <div
      style={{
        gridRow:
          match.round != 1 ? `span ${span}/ span ${span}` : "span 1/span 1",
      }}
      className={`relative flex flex-col justify-center`}
    >
      <div className="group flex">
        {match.round != 1 && !isFill && (
          <div className="border-border absolute bottom-1/2 -left-4 w-3 border-b-2"></div>
        )}

        <div className="text-muted-foreground flex w-[20px] items-center font-medium">
          {match.suggested_play_order}
        </div>
        <div className="bg-card border-border flex w-[220px] flex-col overflow-hidden rounded-md rounded-r-none border-2 border-r-0">
          <div className="border-border flex h-[30px] w-full border-b-1">
            <div className="bg-secondary text-muted-foreground flex w-[40px] items-center justify-center font-medium">
              {match.player1_id ? participant[match.player1_id].seed : ""}
            </div>
            <div
              onMouseEnter={() =>
                match.player1_id && onParticipantHover(match.player1_id)
              }
              onMouseLeave={() => onParticipantHover(null)}
              className={cn(
                "text-card-foreground scroll-hidden flex-1 overflow-x-auto pl-2 font-semibold whitespace-nowrap",
                {
                  "bg-primary text-primary-foreground": isParticipantHovered(
                    match.player1_id,
                  ),
                },
              )}
            >
              {match.player1_id ? participant[match.player1_id].name : ""}
            </div>
          </div>
          <div className="flex h-[30px] w-full">
            <div className="bg-secondary text-muted-foreground flex w-[40px] items-center justify-center font-medium">
              {match.player2_id ? participant[match.player2_id].seed : ""}
            </div>
            <div
              onMouseEnter={() =>
                match.player2_id && onParticipantHover(match.player2_id)
              }
              onMouseLeave={() => onParticipantHover(null)}
              className={cn(
                "text-card-foreground scroll-hidden flex-1 overflow-x-auto pl-2 font-semibold whitespace-nowrap",
                {
                  "bg-primary text-primary-foreground": isParticipantHovered(
                    match.player2_id,
                  ),
                },
              )}
            >
              {match.player2_id ? participant[match.player2_id].name : ""}
            </div>
          </div>
        </div>
        {match.state == "pending" && (
          <div className="bg-card text-muted-foreground hover:text-primary border-border flex w-[40px] items-center justify-center rounded-r-md border-2 border-l-0">
            {/* <SquarePen /> */}
          </div>
        )}
        {match.state == "open" && (
          <div className="bg-card text-muted-foreground hover:text-primary border-border flex w-[40px] items-center justify-center rounded-r-md border-2 border-l-0">
            <SquarePen />
          </div>
        )}
        {match.state == "complete" && (
          <div className="border-border flex w-[40px] flex-col overflow-hidden rounded-r-md border-2 border-l-0">
            <div
              className={cn(
                "flex h-[30px] items-center justify-center font-medium",
                {
                  "bg-secondary text-secondary-foreground":
                    match.loser_id == match.player1_id,
                  "bg-primary text-primary-foreground":
                    match.winner_id == match.player1_id,
                },
              )}
            >
              {player1}
            </div>
            <div
              className={cn(
                "flex h-[30px] items-center justify-center font-medium",
                {
                  "bg-secondary text-secondary-foreground":
                    match.loser_id == match.player2_id,
                  "bg-primary text-primary-foreground":
                    match.winner_id == match.player2_id,
                },
              )}
            >
              {player2}
            </div>
          </div>
        )}

        {/* hover edit score */}
        {match.state == "complete" && (
          <div className="bg-card/90 border-border absolute left-[100%] z-[50] hidden h-[64px] gap-x-4 items-center justify-center rounded-md border-2 px-4 group-hover:flex">
            <SquarePen className="hover:text-primary" />
            <RotateCcw className="hover:text-primary" />
          </div>
        )}
      </div>

      {/* connector */}
      {hasRightConnector && isUp && !isOnlyOneChild && (
        <div
          style={{ top: isUp ? "0" : "auto" }}
          className="border-border absolute left-full h-1/2 w-4 border-r-2 border-b-2"
        ></div>
      )}
      {hasRightConnector && !isUp && !isOnlyOneChild && (
        <div
          style={{ bottom: !isUp ? "0" : "auto" }}
          className="border-border absolute left-full h-1/2 w-4 border-t-2 border-r-2"
        ></div>
      )}
    </div>
  );
};

export default MatchCard;
