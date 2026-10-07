import { useSeo } from "../hooks/useSeo.js";
import Container from "../components/common/Container.jsx";
import Button from "../components/common/Button.jsx";

export default function NotFound() {
  useSeo({ title: "Page not found", path: "/404" });
  return (
    <section className="section bg-cream">
      <Container className="max-w-2xl">
        <h1 className="display">Page not found</h1>
        <p className="lead mt-5 text-muted">The page you are looking for does not exist or has moved.</p>
        <Button to="/" className="mt-8">Back to home</Button>
      </Container>
    </section>
  );
}
