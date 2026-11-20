// The old page fade wrapped every page in a transformed div. A transform makes
// a stacking context, which would trap page content below Chanchal's canvas,
// so pages now render straight into <main>.
export default function Template({ children }) {
  return children;
}
