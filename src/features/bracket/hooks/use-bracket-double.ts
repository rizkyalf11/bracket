import { Match, Participant } from "../types/tournament";

export const useBracketDouble = (
  matches: { match: Match }[],
  participants: { participant: Participant }[],
) => {
  console.log(matches);
  console.log(participants);
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

  let groupedMatchesUpper: { [key: number]: Match[] } = matches.reduce(
    (acc, { match }) => {
      if (match.round > 0) {
        if (!acc[match.round]) acc[match.round] = [];
        acc[match.round].push(match);
      }
      return acc;
    },
    {},
  );
  let groupedMatchesLower: { [key: number]: Match[] } = matches.reduce(
    (acc, { match }) => {
      if (match.round < 0) {
        if (!acc[match.round]) acc[match.round] = [];
        acc[match.round].push(match);
      }
      return acc;
    },
    {},
  );
  console.log(groupedMatchesLower)

  function rebalanceRounds(data) {
    const keys = Object.keys(data)
      .map(Number)
      .sort((a, b) => a - b);
    const result = {};
    let prevLength = Infinity;

    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      const matches = [...(data[key] || [])];

      // Gabungkan sisa jika sebelumnya ada kelebihan
      if (!result[key]) result[key] = [];

      let allMatches = [...result[key], ...matches];
      let allowed = Math.min(prevLength, allMatches.length);

      result[key] = allMatches.slice(0, allowed).map((match) => ({
        ...match,
        round: key,
      }));

      let excess = allMatches.slice(allowed);
      prevLength = result[key].length;

      // Distribusi sisa ke key berikutnya, bikin key baru kalau perlu
      let nextKey = key + 1;
      while (excess.length > 0) {
        if (!result[nextKey]) result[nextKey] = [];

        const allowedNext = Math.min(prevLength, excess.length);
        const portion = excess.slice(0, allowedNext).map((match) => ({
          ...match,
          round: nextKey,
          isCollapse: true,
        }));

        result[nextKey] = result[nextKey].concat(portion);
        excess = excess.slice(allowedNext);
        prevLength = result[nextKey].length;
        nextKey++;
      }
    }

    return result;
  }
  const fixedRounds = rebalanceRounds(groupedMatchesUpper);
  groupedMatchesUpper = fixedRounds;

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
      if (i % 2 == 0) {
        if (
          groupedMatchesUpper[2][checkRound2Order].player1_prereq_match_id ==
          null
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
          groupedMatchesUpper[2][checkRound2Order].player2_prereq_match_id ==
          null
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
    if (groupedMatchesUpper[round][0].isCollapse == null) {
      if (!roundChildCount[round]) roundChildCount[round] = 0;
      roundChildCount[round] = groupedMatchesUpper[round].length;
    }
  });

  return {
    isLoading,
    groupedMatchesUpper,
    participantWithKey,
    totalRows,
    roundChildCount,
  };
};
