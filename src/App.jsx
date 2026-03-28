import { useGameState } from "./hooks/useGameState";
import TitleScreen   from "./screens/TitleScreen";
import CreateScreen  from "./screens/CreateScreen";
import StageScreen   from "./screens/StageScreen";
import EndingScreen  from "./screens/EndingScreen";

export default function App() {
  const {
    state,
    goCreate, setName, startGame,
    choose, nextEvent,
    completeShellGame, completeSurgery,
    restart,
  } = useGameState();

  switch (state.screen) {
    case "title":
      return <TitleScreen onStart={goCreate} />;
    case "create":
      return (
        <CreateScreen
          state={state}
          onSetName={setName}
          onConfirm={startGame}
        />
      );
    case "stage":
      return (
        <StageScreen
          state={state}
          onChoose={choose}
          onNextEvent={nextEvent}
          onCompleteShellGame={completeShellGame}
          onCompleteSurgery={completeSurgery}
        />
      );
    case "ending":
      return <EndingScreen state={state} onRestart={restart} />;
    default:
      return null;
  }
}
