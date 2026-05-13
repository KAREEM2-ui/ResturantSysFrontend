import { Login } from "../components/auth/Login";

export default function HomePage() {
  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center relative w-full"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1600&q=80')",
      }}
    >

    <div className="w-2/4 bg-transparent">
        <Login />
    </div>
    
 

      </div>
  );
}