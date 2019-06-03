import dva from 'dva';
import './index.css';
// import "cesium/Source/Widgets/widgets.css";

// 1. Initialize
const app = dva();

// 2. Plugins
// app.use({});

// 3. Model
app.model(require('./models/loginPage').default);
app.model(require('./models/indexPage').default);

// 4. Router
app.router(require('./router').default);

// 5. Start
app.start('#root');
