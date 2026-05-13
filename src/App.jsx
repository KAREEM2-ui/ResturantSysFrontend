import { Suspense } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import AdminLayout from "./components/admin/AdminLayout";
import { sectionRoutes, homeRoute } from "./components/admin/admin-config";
import { Skeleton } from "./components/ui/skeleton";

function PageSkeleton() {
  return (
    <div className="flex flex-col space-y-4 p-8 w-full h-full">
      <Skeleton className="h-12 w-62.5" />
      <Skeleton className="h-4 w-75" />
      <div className="space-y-2 mt-8">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-100 w-full" />
      </div>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/home"
          element={
            <Suspense fallback={<PageSkeleton />}>
              <homeRoute.component />
            </Suspense>
          }
        />
        <Route path="/login" element={<Navigate to="/home" replace />} />
        <Route path="/" element={<Navigate to="/home" replace />} />
        

        <Route
          path="/admin"
          element={<AdminLayout />}
        >
          <Route index element={<Navigate to="orders" replace />} />
          <Route path="summary" element={<Navigate to="orders" replace />} />
          {sectionRoutes
            .filter((section) => section.path)
            .map((section) => {
              const Component = section.component;

              return (
                <Route 
                  key={section.path} 
                  path={section.path} 
                  element={
                    <Suspense fallback={<PageSkeleton />}>
                      <Component />
                    </Suspense>
                  } 
                />
              );
            })}

          {sectionRoutes
            .filter((section) => !section.path && Array.isArray(section.paths))
            .flatMap((section) => section.paths)
            .map((child) => {
              const Component = child.component;

              return (
                <Route 
                  key={child.path} 
                  path={child.path} 
                  element={
                    <Suspense fallback={<PageSkeleton />}>
                      <Component />
                    </Suspense>
                  } 
                />
              );
            })}
        </Route>
        <Route path="*" element={<Navigate to="/home" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
