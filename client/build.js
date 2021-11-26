import esbuildServe from "esbuild-serve";
import sassEs from "essass";
import yargs from 'yargs';

async function main(options) {
  try {
    await esbuildServe(
      {
        entryPoints: ["src/index.tsx"],
        bundle: true,
        outdir: "dist",
        logLevel: "info",
        sourcemap: true,
        minify: true,
        // TODO: Enable code splitting
        // splitting: true,
        // format: "esm",
        plugins: [
          sassEs,
        ],
        loader: {
          ".png": "file",
          ".html": "text",
          // Loaders for font-awesome icons
          '.eot': 'file',
          '.woff': 'file',
          '.woff2': 'file',
          '.svg': 'file',
          '.ttf': 'file',
        },
        define: {
          // TODO: Set to production only during prod builds
          'process.env.NODE_ENV': "'production'",
        }
      },
      {
        root: "dist",
      }
    );
  } catch (err) {
    process.exit(1);
  }
}

main(yargs(process.argv).argv);
