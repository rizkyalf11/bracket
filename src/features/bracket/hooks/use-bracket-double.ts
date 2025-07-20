import { Match, Participant } from "../types/tournament";

export const useBracketDouble = (
  matches: { match: Match }[],
  participants: { participant: Participant }[],
) => {
  const isLoading = matches.length === 0 || participants.length === 0;

  if (isLoading) {
    return {
      isLoading,
      groupedMatchesUpper: {},
      participantWithKey: {},
      totalRows: 0,
      roundChildCount: {},
    };
  }

  const groupedMatchesUpper: { [key: number]: Match[] } = matches.reduce(
    (acc, { match }) => {
      if (match.round > 0) {
        if (!acc[match.round]) acc[match.round] = [];
        acc[match.round].push(match);
      }
      return acc;
    },
    {},
  );

  console.log(groupedMatchesUpper);
  const participantWithKey: { [key: number]: Participant } =
    participants.reduce((acc, { participant }) => {
      if (!acc[participant.id]) acc[participant.id] = {};
      acc[participant.id] = participant;
      return acc;
    }, {});

  const cloneRound1 = groupedMatchesUpper[1];
  groupedMatchesUpper[1] = [];
  const totalRows = groupedMatchesUpper[2].length * 2;

  let checkRound2Order = 0;
  let takeOrder = 0;
  const generateBlankMatch = (i: number) => {
    return {
      isHidden: true,
      id: Date.now() + Math.floor(Math.random() * 1000) + i,
      round: 1,
    };
  };

  for (let i = 0; i < totalRows; i++) {
    if (i % 2 === 0 && i !== 0) {
      checkRound2Order++;
    }
    if (i == 0) {
      if (groupedMatchesUpper[2][checkRound2Order].player1_prereq_match_id == null) {
        groupedMatchesUpper[1].push(generateBlankMatch(i));
      } else {
        groupedMatchesUpper[1].push({ ...cloneRound1[takeOrder], isHidden: false });
        takeOrder++;
      }
    } else {
      if (i % 2 == 0) {
        if (
          groupedMatchesUpper[2][checkRound2Order].player1_prereq_match_id == null
        ) {
          groupedMatchesUpper[1].push(generateBlankMatch(i));
        } else {
          groupedMatchesUpper[1].push({
            ...cloneRound1[takeOrder],
            isHidden: false,
          });
          takeOrder++;
        }
      } else {
        if (
          groupedMatchesUpper[2][checkRound2Order].player2_prereq_match_id == null
        ) {
          groupedMatchesUpper[1].push(generateBlankMatch(i));
        } else {
          groupedMatchesUpper[1].push({
            ...cloneRound1[takeOrder],
            isHidden: false,
          });
          takeOrder++;
        }
      }
    }
  }

  const roundChildCount: { [key: number]: number } = {};
  Object.keys(groupedMatchesUpper).map((round) => {
    if (!roundChildCount[round]) roundChildCount[round] = 0;
    roundChildCount[round] = groupedMatchesUpper[round].length;
  });

  return {
    isLoading,
    groupedMatchesUpper,
    participantWithKey,
    totalRows,
    roundChildCount,
  };
};
