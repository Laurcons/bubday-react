import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import HomePage from './routes';
import InvitationPage from 'src/routes/i/code';
import { QueryClient, QueryClientProvider } from 'react-query';
import { InviteeProvider } from 'src/lib/useUser';

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
        <RouterProvider router={router}></RouterProvider>
      </InviteeProvider>
    </QueryClientProvider>
  );
}

export default App;
