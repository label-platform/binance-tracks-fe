import { RecoilRoot } from "recoil"
import '@styles/base.styles.css';

export const parameters = {
  actions: { argTypesRegex: "^(on|handle)[A-Z].*" },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
}

export const decorators = [
  (Story) => (
    <RecoilRoot>
      <div style={{ width: '100%', height: '100%', backgroundColor: '#121212', padding:'10px' }}>
        <Story />
      </div>
    </RecoilRoot>
  ),
]