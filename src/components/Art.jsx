// Renders a hand-drawn SVG string (from art.js) inside any element.
export default function Art({ as: Tag = "div", html, ...props }) {
  return <Tag {...props} dangerouslySetInnerHTML={{ __html: html }} />;
}
