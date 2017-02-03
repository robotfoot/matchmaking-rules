% Central rule for matchmaking: Find a collection of players that meet the match score and are over the min match size.
match(Players, Score, Threshold, MatchSize) :-
  player_combination(Players),
  score(Players, Score),
  length(Players, MatchSize),
  Score >= Threshold.

% The score for a group of players checks all pairwise relationships
% score is averaged over match size
score([FirstPlayer | OtherPlayers], Score) :-
  score(FirstPlayer, OtherPlayers, FirstPlayerScore),
  score(OtherPlayers, OtherPlayersScore),
  length([FirstPlayer | OtherPlayers], Length),
  Score is (OtherPlayersScore + FirstPlayerScore)/Length.

% The score for an empty group of players is zero
score(EmptyPlayerList, 0) :-
  is_list(EmptyPlayerList),
  length(EmptyPlayerList, 0).

% The score for a group of players with only one person is also zero
score(PlayerListWithOnePlayer, 0) :-
  is_list(PlayerListWithOnePlayer),
  length(PlayerListWithOnePlayer, 1).

% The score for one player and an empty group is also zero
score(Player, [], 0) :-
  player(Player).

% The score for one player in relation to a group
score(FirstPlayer, OtherPlayersInGroup, Score) :-
  is_list(OtherPlayersInGroup),
  OtherPlayersInGroup = [SecondPlayer | OtherPlayersTail],
  pairwise_score(FirstPlayer, SecondPlayer, PairwiseScore),
  score(FirstPlayer, OtherPlayersTail, RestScore),
  Score is PairwiseScore + RestScore.

% Compatibility score between two players
pairwise_score(PlayerOne, PlayerTwo, Score) :-
  level(PlayerOne, LevelPlayerOne),
  level(PlayerTwo, LevelPlayerTwo),
  LevelDiff is abs(LevelPlayerOne - LevelPlayerTwo),
  safe_level_diff(SafeLevelDiff, LevelDiff),
  level_diff_score(SafeLevelDiff, Score).

% If they have the same level, award .5 points (inverse makes this 2).
safe_level_diff(0.5, 0.0).

% Otherwise, the score is proportional to 1/difference in level
safe_level_diff(LevelDiff, LevelDiff) :-
  LevelDiff > 0.0.

% Define a group of players
player_combination([PlayerA | [PlayerB]]):-
  player(PlayerB),
  player(PlayerA),
  PlayerA \== PlayerB.

player_combination([PlayerC | OtherPlayers]) :-
  player_combination(OtherPlayers),
  player(PlayerC),
  is_not_a_member(PlayerC, OtherPlayers).

is_not_a_member(Player, OtherPlayerList) :-
  OtherPlayerList = [H | T],
  Player \== H,
  is_not_a_member(Player, T).

is_not_a_member(Player, []) :-
  player(Player).

% Level Diff score
level_diff_score(SafeLevelDiff, LevelDiffScore) :-
  LevelDiffScore is 1.0/SafeLevelDiff.
