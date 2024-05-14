const isHeading = (line) => line[0] === "#";
const isSubHeading = (line) => line.slice(0,2) === "##";

window.onload = () => {
    console.log(".");

    const groups = [];
    
    document.getElementById("example").addEventListener("click", (ev) => {
        document.getElementById("data").value = exampleData;
    });

    document.getElementById("submit").addEventListener("click", (ev) => {
        // console.log(document.getElementById("data").value);
        const data = document.getElementById("data").value.split("\n");

        document.body.innerHTML = "";
        
        if (data[0] != undefined) {
            const title = document.createElement("h1");
            title.innerText = data[0];
            document.body.appendChild(title);
            document.title = data[0];
        }

        for (let i = 1; i < data.length; i++) {
            if (data[i] === undefined) continue;
            if (isHeading(data[i])) {
                if (data[i] === undefined) continue;

                // This is a headline, start a new UPC group
                let heading;
                if (isSubHeading(data[i])) {
                    console.log("hah");
                    heading = document.createElement("h4");
                    heading.innerText = data[i].trim().replace("## ", "");
                } else {
                    heading = document.createElement("h2");
                    heading.innerText = data[i].trim().replace("# ", "");
                }
                document.body.appendChild(heading);
                const div_upc_group = document.createElement("div");
                div_upc_group.classList.add("flex");

                while (data[++i] && !isHeading(data[i]) && i < data.length) {
                    console.log(data[i]);
                    if (data[i] === undefined) continue;
                    const [upc, title, desc] = data[i].split(", ");
                    if (!upc) continue;

                    const div_item = document.createElement("div");
                    div_item.classList.add("flex-item");

                    const p_barcode = document.createElement("p");
                    p_barcode.innerText = upc.length === 12 ? upc : upc + "?";
                    p_barcode.classList.add("barcode");
                    div_item.appendChild(p_barcode);

                    if (title) {
                        const p_title = document.createElement("p");
                        p_title.innerText = title;
                        div_item.appendChild(p_title);
                    }

                    if (desc) {
                        const p_desc = document.createElement("p");
                        p_desc.innerText = desc;
                        div_item.appendChild(p_desc);
                    }

                    div_upc_group.appendChild(div_item);
                }
                document.body.appendChild(div_upc_group);
                --i;
            }
        }
    });
};

const exampleData = 
`Deli Department Catalogs

# Catalog 59 (Frozen)

## Frozen Chicken
07701314569, Pilgrim Chicken Tender Jumbo
07701314569, Pilgrim Bread Chicken Tender RTE
07701314570, Pilgrims Breaded Wings Boneless
07701314571, Pilgrim Breaded Bone In Wings RTE
07701316787, Pilgrims Roasted Wings RTE
07701316813, Pilgrims Sizzlin Hot Wings RTE
07701314572, FFMKT POPCORN CKN

## Other
64220553788, FMKT TURKY SPLT BRST
84013430706, HMCF STL RIBS FULL SLAB C
04771709103, SEASONED SHREDDED PORK CA
04497900417, LBWN CRCKL CUT POTATO WDG
28684780000, DELI PULLED PORK BBQ C
28661980000, DELI PULLED CKN BBQ C
02802915642, TRSF TRIDENT POLLOCK FISH

## Salad Case
28661980000, Mont Inn BBQ Chicken
28684780000, Mont Inn BBQ Pork

# Catalog 34 (Shared Perishable)

## Salad Case POG
21974900000, Banana Pudding
03022311604, Buffalo Chicken Salad
03022311090, Chicken Salad
03022311091, Queen City Chkn Sld w/ Grp & Pcn
03022311444, Loaded Potato Salad
07111700188, Macaroni Salad
22555510000, Pesto Chicken Salad
23222200000, Spicy Italian Pasta Salad
24733780000, Summer Slaw

## Other Salads
01345438398, ANTIPASTA PASTA SALAD
07111711439, RESERS SEAFOOD SALAD KIT
03022309223, DELI SUMMER SLAW
01111074048, KRO CRNBY CELEBRT SALAD
07111700188, RESERS MACARONI SALAD
07111700280, RESERS PISTACHIO DELIGHT
07111710932, PINA COLADA DELIGHT
01111092020, KRO STRAWBRY CHEESECAKE
01111092033, KB BANANA PUDDING

## Production
75410200022, CLASSIC DEVILED EGG KIT
07750901250, OZRK BEAN DIP KIT
08919370132, OJCK FDSRV LAHVASH
03614406240, GEHLS PRM NACHO CHS SCE
07015329916, RNDL RNCH WHP CRM CHS
01111062765, HMCF RSTD PLLD CKN
84013430481, HMCF CHDR MAC CHS
01345438399, RESERS PEPPERONI PIZZA
84013430436, HMCF CARNE ASADA ST TACO
84013430435, RESERS FH CKN ST TACO
84013430852, HMCF ASIAN CKN STR FRY
07705231258, MILL ROSE FRM SLCD PPPRNI

## Bulk Cheese
03614406240, Gehl's Nacho Cheese
01111058673, KRO YELLOW AMERICAN CHS
01111058674, KRO WHITE AMERICAN CHS
03450048107, LOL YLW AMERICAN CHEESE
01111060715, PRSL BABY SWISS CHEESE
01111060716, PRSL COLBY JACK HORN CHS
01111060719, PRSL COLBY MINI HORN
01111062268, PS FUEGO JACK
01111058364, PRSL GOUDA AGED CHS
01111000274, PRSL HAVARTI PLAIN
01111060718, PRSL MILD CHEDDAR CHEESE
01111000041, PRSL MUENSTER CHEESE
01111060717, PRSL PEPPERJACK LOAF CHS
01111009857, PRSL PROVOLONE CHEESE RW
01111062304, PRSL SMOKED PROVOLONE
01111009726, PRSL SHARP CHEDDAR
01111060724, PRSL SWISS CHEESE LOAF

## GNG
01111022290, KRO YELLOW AMER CHS GNG
01111022291, KRO WHT AMER CHS GNG
01111022284, PRSL COLBY JCK GNG
01111022285, PRSL COLBY CHS GNG
01111010796, PRSL PEPPERJACK GNG CHS
01111022287, PRSL PROVOLONE CHS GNG
01111009763, PRSL SHARP CHEDDAR GNG
01111022289, PRSL BBY SWISS SLCD GNG
01111022288, PRSL SWISS CHS SLCD GNG
01111061627, PS SLICED PEPPERED TURKEY
01111007174, PRSL GENOA SALAMI SLD
01111007173, PRSL HARD SALAMI SLCD
01111007172, PRSL PEPPERONI SLICED
01111095558, PRSL WLDFLWR HNY HAM
01111095559, PRSL WLDFLOWR HNY TURKEY
01111095557, PRSL MESQUITE TRKY
01111060884, PRSL OVN RSTD TURKEY BRST
01111060885, PRSL BRWN SUGAR HAM

## Bulk Beef
01111060263, PRSL Angus Roast Beef Medium
01111007112, PRSL Choice Corn Beef
01111007111, PRSL Choice Pastrami
01111099503, PRSL Choice Roast Beef Well
01111061976, PS Soppressata

## Bulk Ham
01111099024, PRSL Black Forest Ham 2x 8#
01111099415, PRSL Brown Sugar Ham 4x 3-5.5# 
01111060885, PS Brown Sugar Ham 6x 3#
01111058876, PS Tavern Ham
01111018103, PS Honey Ham Half 4x 5.35# 

## Bulk Turkey
01111099498, PS Mesquite Turkey 2x 8.5#
01111099496, PS Oven Turkey 2x 9#
01111060884, PS Oven Turkey 6x 4.33#
01111099497, PS Honey Turkey 2x 9.65#
01111061242, PS Blackened Turkey
01111060734, PS Pepper Turkey

## Bulk Chicken
01111022351, PS Hot Honey Chicken
01111058667, PS Gold Chicken LS

## Loaves
04450006131, Kahn's Deluxe Club Bologna
01111052230, PS Beef Bologna
01111060273, PS Genoa Salami 
01111060274, PS Hard Salami
01111019000, PS Pickle Pepper Loaf
01111099838, PS Pepperoni

## Hot Sides
01111037260, KRO CRMY MAC CHEESECAKE
01111038666, KRO MASHED POTATOES
01111095212, KROGER TURKEY GRAVY
07464101201, CFRS KERNEL CORN COOKED

# Catalog 58 (Meat)

## Chicken
07029216392, S M DELI CHKN BRD II
04172302345, PGPR CUT UP CKN
07563245811, PGPR CKN TENDER JUMBO
07563293085, MARINATED CHICKEN DRUMSTICK
84013430006, PILG SAV RSTD CKN
84013430007, HMCF GRLC HRB WHL CKN
07496035810, ST DELI CKN

# Catalog 69 (Payton)
76308996794, CHICKEN BREADING
40519206794, SAVRY CHCKN SEASONING
04150001270, CATTLEMENS MEMPHIS BBW
04150001269, FRANKS REDHOT BUFFALO WIN
01300053060, HEINZ SS MUSTARD
02100066371, KRFT INDV MRCL WHP DRSSG
01300053160, HEINZ TARTAR SAUCE
01300098320, HEINZ KETCHUP PKTS 200C
07550000003, CONDIMENTS-TX PETE PACKS
`