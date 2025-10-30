import { useParams } from "react-router-dom";

export default function Review() {
  const { id } = useParams();
  return <h1>Review Page for Stylist ID: {id}</h1>;
}
