import {createBrowserHistory} from 'history';

const history = createBrowserHistory({
  basename: process.env.basePath,
  forceRefresh: !('pushState' in window.history)
});

export default history;
