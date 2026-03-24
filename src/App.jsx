import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { authLink, dashboardLink, landingLink } from './data/link';
import { AuthLayout, DashboardLayout, LandingLayout } from './layouts';
import { flattenLandingLinks } from './utils/landingLink';
import { Notfound } from './pages/result';
import Guard from './components/Guard';
import { useMemo } from 'react';

import './index.css';
import SuccessRegisterKonseli from './pages/result/SuccessRegisterKonseli';
import FailedRegisterKonseli from './pages/result/FailedRegisterKonseli';
import { CreateArticle, EditArticle, KonselisProfile, Matrix, Questions, Report } from './pages/dashboard';
import { Assessment, ReadArticle } from './pages/landing';
import { SuccessAssessment, FailedAssessment } from './pages/result';

function App() {
  const flatLandingLinks = flattenLandingLinks(landingLink);

  const router = useMemo(() => {
    return createBrowserRouter([
      {
        element: <LandingLayout />,
        children: [
          ...flatLandingLinks.map(({ path, element: Element }) => ({
            path,
            element: <Element />
          })),
          { path: '/success_register_konseli', element: <SuccessRegisterKonseli /> },
          { path: '/failed_register_konseli', element: <FailedRegisterKonseli /> },
          { path: '/success_assessment', element: <SuccessAssessment /> },
          { path: '/failed_assessment', element: <FailedAssessment /> },
          { path: '/artikel/read/:slug', element: <ReadArticle /> },
          { path: '/assessment/:slug', element: <Assessment /> },
          { path: '*', element: <Notfound /> }
        ]
      },
      {
        element: <DashboardLayout />,
        children: [
          ...dashboardLink.flatMap(({ path, element: Element, permissions = [], roles = [], children }) => {
            if (children?.length) {
              return children.map(({ path, element: ChildElement, permissions = [], roles = [] }) => ({
                path,
                element: (
                  <Guard permissions={permissions} roles={roles}>
                    <ChildElement />
                  </Guard>
                )
              }));
            }

            if (path && Element) {
              return [
                {
                  path,
                  element: (
                    <Guard permissions={permissions} roles={roles}>
                      <Element />
                    </Guard>
                  )
                }
              ];
            }

            return [];
          }),
          {
            path: '/profile_konseli',
            element: <KonselisProfile />
          },
          { path: '/articles/create', element: <CreateArticle /> },
          { path: '/articles/edit/:slug', element: <EditArticle /> },
          { path: '/dashboard/assessments/:assessmentId/questions', element: <Questions /> },
          { path: '/dashboard/assessments/:assessmentId/matrix', element: <Matrix /> },
          { path: '/dashboard/sesi_konseling/:sesi_konseling_id/report', element: <Report /> }
        ]
      },

      // AUTH
      {
        element: <AuthLayout />,
        children: authLink.map(({ path, element: Element }) => ({
          path,
          element: <Element />
        }))
      }
    ]);
  }, [flatLandingLinks]);

  return <RouterProvider router={router} />;
}

export default App;
