function pokemonTemplate(pokemonName, pokemonNumber, pokemonShiny, pokemonType) {
    return {
        name: pokemonName,
        url: `https://pokemon.fandom.com/wiki/${pokemonName}`,
        front_default: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemonNumber}.png`,
        shiny: pokemonShiny || false,
        type: [pokemonType] || ['unknown'],
        number: pokemonNumber || 1,
    }
};

module.exports = pokemonTemplate;