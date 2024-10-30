{
  description = "GGRIMS Next.js Development Environment";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs = { self, nixpkgs, flake-utils }:
    flake-utils.lib.eachDefaultSystem (system:
      let
        pkgs = nixpkgs.legacyPackages.${system};
      in
      {
        packages.default = pkgs.nodejs_20;
        
        devShells.default = pkgs.mkShell {
          buildInputs = with pkgs; [
            nodejs_20
            nodePackages.pnpm
            nodePackages.typescript
            nodePackages.typescript-language-server
            git
          ];

          shellHook = ''
            echo "🚀 Welcome to GGRIMS development environment!"
            echo "Node $(node --version)"
            echo "PNPM $(pnpm --version)"
            
            export PNPM_HOME="$HOME/.local/share/pnpm"
            export PATH="$PNPM_HOME:$PATH"
          '';
        };
      }
    );
}