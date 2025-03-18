import "./App.css";
import { Chat } from "./components/chat/Chat";

function App() {
  return (
    <div className="flex flex-col p-4 md:p-8">
      <main className="flex-1 flex">
        <Chat />
      </main>
    </div>
  );
}

export default App;
