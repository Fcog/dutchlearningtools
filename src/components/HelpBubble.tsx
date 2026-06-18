interface Props {
  children: React.ReactNode;
}

export function HelpBubble({ children }: Props) {
  return (
    <div className="help-bubble" role="note">
      <span className="help-bubble-arrow" />
      {children}
    </div>
  );
}
