import React, { useCallback } from "react";
import { initializeLex } from '../utils/lex';

// NOTE: This component configures and renders the Lex searchbar. It acts
//       mostly as a view that passes back the user inputted filters
//       to its parent.
export default function SearchBar(props) {
  // TODO: Currently we pass Lex filters back to the parent view via props
  //       using this callback function that is triggered on a Lex component
  //       change, however, it would be ideal to sync the Router URL query parameters
  //       to filter changes using Redux. This provides us with two advantages:
  //       1. Search filter state can be passed easily between views without a chain
  //          of callbacks.
  //       2. Synchronizing the URL query params to the search filters would allow a user to
  //          easily send their search filters to other users via a URL link.
  const lex = initializeLex(filters => props.setFilters(filters));
  const searchBarContainerRef = useCallback(node => {
    if (node !== null) {
      lex.render(node);
      lex.focus();
    }
  }, []);

  return (
    <div ref={searchBarContainerRef} className="search-bar"></div>
  )
}

