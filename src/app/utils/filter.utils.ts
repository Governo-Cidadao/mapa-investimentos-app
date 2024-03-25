export class FilterUtil {
    public static hasEstadoMuniTerrTipoInvestCateg(layer: any, filterValue: string) {
        const estabelecimento = layer.properties.estabelecimento;
        const municipio = layer.properties.municipio;
        const territorio = layer.properties.territorio;
        const tipoDeInvestimento = layer.properties.tipoDeInvestimento;
        const categoriaMapeamento = layer.properties.categoriaMapeamento;

        return municipio.toLowerCase().includes(filterValue) || territorio.toLowerCase().includes(filterValue)
            || tipoDeInvestimento.toLowerCase().includes(filterValue) || categoriaMapeamento.toLowerCase().includes(filterValue)
            || estabelecimento.toLowerCase().includes(filterValue);
    }
}