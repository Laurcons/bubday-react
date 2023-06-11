import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import HomePage from './routes';
import InvitationPage from 'src/routes/i/code';
import { QueryClient, QueryClientProvider } from 'react-query';
import { InviteeProvider } from 'src/lib/useUser';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';
import { DeadlineProvider } from 'src/lib/useDeadline';

const router = createBrowserRouter([
  {
    path: '/',
    element: <HomePage />,
  },
  {
    path: '/i/:urlCode',
    element: <InvitationPage />,
  },
]);

function App() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return (
    <QueryClientProvider client={queryClient}>
      <InviteeProvider>
        <DeadlineProvider>
          <RouterProvider router={router}></RouterProvider>
          <ToastContainer />
        </DeadlineProvider>
      </InviteeProvider>
    </QueryClientProvider>
  );
}

export default App;
