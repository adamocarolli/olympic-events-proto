import { Lex, TransitionFactory, LabelState, ValueState, ValueStateValue, NumericEntryState, TextEntryState, NumericRelationState, TextRelationState } from '@uncharted.software/lex/dist/lex';

export const LEX_VALUE_TYPES = {
  NUMERIC: 'numeric',
  STRING: 'string',
}

// NOTE: `initializeLex` configures and creates a Lex searchbar component. The Lex library works as
//       finite state machine where a user steps through each state in order to build a search filter.
//       This function defines the search language used by Lex, for more info see:
//       https://github.com/unchartedsoftware/lex
export const initializeLex = (onSearchChange: (filters: any) => void) => {
  const language = Lex
    // NOTE: In the initial state we begin by suggesting field options that the user
    //       can select. This gives the user an idea about what can be searched.
    .from('field', ValueState, {
      name: 'Choose a field to search',
      suggestions: [
        new ValueStateValue('Age', { type: LEX_VALUE_TYPES.NUMERIC }),
        new ValueStateValue('Height', { type: LEX_VALUE_TYPES.NUMERIC }),
        new ValueStateValue('Weight', { type: LEX_VALUE_TYPES.NUMERIC }),
        new ValueStateValue('Sex', { type: LEX_VALUE_TYPES.STRING }),
      ],
      // TODO: Add font-awesome magnifying glass icon here.
      icon: '<span></span>'
    })
    // NOTE: Once a user has selected a suggested field we must transition into an appropriate
    //       state based on the selection. There are two branches here, one that handles numeric type
    //       suggestions and the other that handles text suggestions.
    .branch(
      Lex
        .from('relation', TextRelationState, {
          // NOTE: Ensure parents state value has a metadata type of string
          ...TransitionFactory.valueMetaCompare({type: LEX_VALUE_TYPES.STRING}),
        })
        .branch(
          // NOTE: Once a relationship type has been selected we provide the user
          //       with a text entry input field.
          Lex.from('value', TextEntryState)
        ),
      Lex
        .from('relation', NumericRelationState, {
          // NOTE: Ensure parents state value has a metadata type of numeric
          ...TransitionFactory.valueMetaCompare({type: LEX_VALUE_TYPES.NUMERIC}),
        })
        .branch(
          // NOTE: Once a relationship type has been selected we provide the user
          //       with a number entry input field.
          Lex.from('value', NumericEntryState, TransitionFactory.valueKeyIsNot('between')),
          Lex.from('value', NumericEntryState, TransitionFactory.valueKeyIs('between')).to(LabelState, {label: 'and'}).to('secondaryValue', NumericEntryState)
        )
    );

    // Initialize Lex HTMLElement
    const lex = new Lex({
    language: language,
    // TODO: Add font-awesome cross icon here.
    tokenXIcon: '<span>✕</span>'
  });

  // NOTE: When a user finishes inputting a search filter, we pass the new filter (Lex internally uses the term model)
  //       as an argument to the passed in callback function.
  lex.on('query changed', (...args /* [newModel, oldModel, newUnboxedModel, oldUnboxedModel, nextTokenStarted] */) => {
    const newModel = args[0];
    onSearchChange(newModel);
  });
  return lex;
}
