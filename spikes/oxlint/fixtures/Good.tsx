import { React, useTLState } from 'tl-react-bridge';
export const Good = () => { const s = useTLState(); return <div>{String(s)}</div>; };
