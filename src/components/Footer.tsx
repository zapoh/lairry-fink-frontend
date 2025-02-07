export function Footer() {
  return (
    <footer className="py-6 border-t border-background-light">
      <div className="container mx-auto px-4">
        <p className="text-center text-gray-400 text-md">
          <span className="text-primary">L(ai)rry Fink</span> is a project by{" "}
          <a 
            href="https://trulyadog.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-white hover:text-primary transition-colors"
          >
            $PAWSY
          </a>{" "}
          ecosystem
        </p>
      </div>
    </footer>
  );
} 