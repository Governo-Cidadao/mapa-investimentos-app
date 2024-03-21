import { FeatureUtils } from "./feature.utils";

export class TreeUtil {
    
    private static capitalizeString(str: string): string {
        return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    }

    public static populateTree(investimentosMapeamento: any, structureInvest: any, vetorMaker: any) {
        investimentosMapeamento.forEach((area: any) => {
            let areaNode = {
                label: ' ' + this.capitalizeString(area.areaMapeamento),
                selectAllCheckbox: true,
                children: [] as Array<{ label: string; selectAllCheckbox: boolean; children: Array<any> }>

            };

            area.tipologias.forEach((tipologia: any) => {
                let tipologiaNode = {
                    label: ' ' + this.capitalizeString(tipologia.tipologiaMapeamento),
                    selectAllCheckbox: true,
                    children: [] as Array<{ label: string; selectAllCheckbox: boolean; children: Array<any> }>

                };
                areaNode.children.push(tipologiaNode);

                tipologia.categorias.forEach((categoria: any) => {
                    let categoriaNode = {
                        label: ' ' + this.capitalizeString(categoria.categoriaMapeamento),
                        selectAllCheckbox: true,
                        children: [] as Array<{ label: string; selectAllCheckbox: boolean; children: Array<any> }>
    
                    };
                    tipologiaNode.children.push(categoriaNode);

                    categoria.elementos.forEach((elemento: any) => {
                        let label = ' ' + this.capitalizeString(elemento.properties.investimentoMapeamento);
                        let marcador = FeatureUtils.createMarker(elemento, label, vetorMaker);
                        categoriaNode.children.push(marcador);

                    })

                })
            })
    
            structureInvest.children.push(areaNode);
        })
    }

    public static filterAreaTipoCate(features: any) {
        let investimentosMapeamento: any = [];
        for (let i = 0; i < features.length; i++) {
            let areaIndex = investimentosMapeamento.findIndex((element: any) =>
                element.areaMapeamento === features[i].properties.areaMapeamento
            );
            if (areaIndex === -1) {
                investimentosMapeamento.push({
                    areaMapeamento: features[i].properties.areaMapeamento,
                    tipologias: [{
                        tipologiaMapeamento: features[i].properties.tipologiaMapeamento,
                        categorias: [{
                            categoriaMapeamento: features[i].properties.categoriaMapeamento,
                            elementos: [features[i]]
                        }]
                    }]
                });
            } else {
                let tipologiaIndex = investimentosMapeamento[areaIndex].tipologias.findIndex((element: any) =>
                    element.tipologiaMapeamento === features[i].properties.tipologiaMapeamento
                );

                if (tipologiaIndex === -1) {
                    investimentosMapeamento[areaIndex].tipologias.push({
                        tipologiaMapeamento: features[i].properties.tipologiaMapeamento,
                        categorias: [{
                            categoriaMapeamento: features[i].properties.categoriaMapeamento,
                            elementos: [features[i]]
                        }]
                    });
                } else {
                    let categoriaIndex = investimentosMapeamento[areaIndex].tipologias[tipologiaIndex].categorias.findIndex((element: any) =>
                        element.categoriaMapeamento === features[i].properties.categoriaMapeamento
                    );

                    if (categoriaIndex === -1) {
                        investimentosMapeamento[areaIndex].tipologias[tipologiaIndex].categorias.push({
                            categoriaMapeamento: features[i].properties.categoriaMapeamento,
                            elementos: [features[i]]
                        });
                    } else {
                        investimentosMapeamento[areaIndex].tipologias[tipologiaIndex].categorias[categoriaIndex].elementos.push(features[i]);
                    }
                }
            }
        }
        return investimentosMapeamento
    }

    public static clickCheckboxTree() {
        const input = document.querySelector<HTMLInputElement>('.leaflet-layerstree-sel-all-checkbox');
        input!.click();
    }
}