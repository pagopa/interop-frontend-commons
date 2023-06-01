/// <reference types="vitest" />

import react from '@vitejs/plugin-react'
import path from 'node:path'
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'
import { visualizer } from 'rollup-plugin-visualizer'
import peerDepsExternal from 'rollup-plugin-peer-deps-external'
import fs from 'fs'

export default defineConfig({
  plugins: [
    react(),
    peerDepsExternal(),
    visualizer(),
    dts({
      insertTypesEntry: true,
      skipDiagnostics: true,
      // This is a workaround to force the generated index.d.ts to use the const keyword for the TRoutes generic
      // This is needed because the dts plugin does not support TypeScript 5.0 yet.
      // Will be removed when it does.
      afterBuild() {
        const indexDtsRouterPath = path.resolve(
          __dirname,
          'dist/features/router/generate-routes.d.ts'
        )
        fs.writeFileSync(indexDtsRouterPath, patchedGenerateRoutesDts)
      },
    }),
  ],
  resolve: {
    alias: {
      '@/': `${path.resolve(__dirname, 'src')}/`,
    },
  },
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/index.ts'),
      name: 'interop-fe-commons',
      fileName: (format) => `index.${format}.js`,
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './setupTests.js',
    coverage: {
      provider: 'c8',
      reporter: ['text', 'lcov'],
    },
  },
})

const patchedGenerateRoutesDts = `
/// <reference types="react" />
import type { GenerateRoutesOptions, Routes } from './router.types';
export declare function generateRoutes<AuthLevel extends string, const TRoutes extends Routes<AuthLevel> = Routes<AuthLevel>>(routes: TRoutes, options?: GenerateRoutesOptions): {
    routes: TRoutes;
    reactRouterDOMRoutes: import("react-router").RouteObject[];
    hooks: {
        useNavigate: import("./router.types").TypedUseNavigate<TRoutes>;
        useGeneratePath: import("./router.types").TypedUseGeneratePath<TRoutes>;
        useLocation: <RouteKey extends keyof TRoutes = keyof TRoutes>() => {
            routeKey: RouteKey;
            state: any;
            key: string;
            pathname: string;
            search: string;
            hash: string;
        };
        useAuthGuard: <RouteKey_1 extends keyof TRoutes = keyof TRoutes>() => {
            isPublic: TRoutes[RouteKey_1]["public"];
            authLevels: TRoutes[RouteKey_1]["authLevels"];
            isUserAuthorized: (userAuth: TRoutes[keyof TRoutes]["authLevels"][number] | TRoutes[keyof TRoutes]["authLevels"][number][]) => boolean;
        };
        useParams: import("./router.types").TypedUseParams<TRoutes>;
        useSwitchPathLang: () => (toLang: string) => void;
    };
    components: {
        Link: <RouteKey_2 extends keyof TRoutes = keyof TRoutes>(props: {
            to: RouteKey_2;
            options?: import("./components/Link").LinkOptions | undefined;
        } & (import("./router.types").ExtractRouteParams<TRoutes[RouteKey_2]["path"]> extends undefined ? object : {
            params: import("./router.types").ExtractRouteParams<TRoutes[RouteKey_2]["path"]>;
        }) & (({
            as?: "link" | undefined;
        } & Omit<import("@mui/material").LinkProps<import("react").ForwardRefExoticComponent<import("react-router-dom").LinkProps & import("react").RefAttributes<HTMLAnchorElement>>, {}>, "component" | "href" | "to">) | ({
            as: "button";
        } & Omit<import("@mui/material").ButtonProps<"button", {}>, "onClick" | "component" | "href" | "to" | "LinkComponent">)), ref: ((instance: HTMLAnchorElement | null) => void) | import("react").RefObject<HTMLAnchorElement> | ((instance: HTMLButtonElement | null) => void) | import("react").RefObject<HTMLButtonElement> | null) => JSX.Element;
        Redirect: <RouteKey_3 extends keyof TRoutes = keyof TRoutes>(props: {
            to: RouteKey_3;
            options?: import("react-router").NavigateOptions | undefined;
        } & (import("./router.types").ExtractRouteParams<TRoutes[RouteKey_3]["path"]> extends undefined ? object : {
            params: import("./router.types").ExtractRouteParams<TRoutes[RouteKey_3]["path"]>;
        })) => null;
        Breadcrumbs: ({ routeLabels }: {
            routeLabels: { [R in RouteKey]: string | false };
        }) => JSX.Element | null;
    };
    utils: {
        getParentRoutes: (input: keyof TRoutes) => (keyof TRoutes)[];
    };
};

`
