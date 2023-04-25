import * as React from 'react'

const wrap = (toWrap, wrapper) => {
    wrapper = wrapper || document.createElement('div');
    toWrap.parentNode.insertBefore(wrapper, toWrap);
    return wrapper.appendChild(toWrap);
};


const modal = ({href}) => {
    const modalConatiner = document.createElement("div") as HTMLDivElement;
    modalConatiner.id = "modal-" + href;
    modalConatiner.className = "project-modal"

    const overlay = document.createElement("div") as HTMLDivElement;
    overlay.className = "modal-bg modal-exit";

    modalConatiner.append(overlay);

    const innerContanier = document.createElement("div") as HTMLDivElement;
    innerContanier.className = "modal-container"

    const exitButton = document.createElement("button") as HTMLButtonElement;
    exitButton.className = "modal-close modal-exit"
    exitButton.innerHTML = "x"


    const iframeContant = document.createElement("iframe") as HTMLIFrameElement;
    iframeContant.src = window.location.protocol +  href

    innerContanier.append(exitButton);
    innerContanier.append(iframeContant);
    modalConatiner.append(innerContanier);

    return modalConatiner;

}

const ProjectSelect = ({children, active = false}): React.FC<{active:boolean}> => {
    const [ready, setReady] = React.useState(false);

    const findGallery = () => {
        return document.getElementsByClassName('notion-gallery-grid')[0]
    }
    React.useEffect( ()=> {
        if(!!window && !!document && active && !ready){
            const gallery = findGallery();
            if(!gallery){
                const blaIntervalId = setInterval(() => {
                    const gallery = findGallery();
                    if(gallery){
                        setReady(true);
                        clearInterval(blaIntervalId)
                    }
                }, 500);
            } else {
                setReady(true);
            }
        }
    }, [children, active, ready]);

    React.useEffect(()=>{
        if(ready){
            const gallery = findGallery()
            if (gallery.hasChildNodes()) {
                const items = gallery?.childNodes;


                // Setting Modal data
                items.forEach((single: HTMLElement) => {
                    const href = single.getAttribute('href')?.replace('/', '');
                    if(href){
                        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                       // @ts-ignore
                       document.body.appendChild(modal({href}));
   
                       single.setAttribute('data-modal', href)
                    }
                });
                

                // Setting checkbox wrap
                items.forEach((single: HTMLElement) => {
                    const checkboxLabel = document.createElement("label") as HTMLLabelElement;
                    const href = single.getAttribute('href')?.replace('/', '');
                    if(href){
                        checkboxLabel.setAttribute("for", href);
                        const checkbox = document.createElement("input");
                        
                        checkbox.type = "checkbox";
                        checkbox.name = "project-select";
                        checkbox.id = href;
                        checkbox.style.display = "none";
                        gallery.prepend(checkbox);
                        
                        wrap(single, checkboxLabel)
                    }
                    
                })

                // Modal open machnisem
                const modals = document.querySelectorAll('[data-modal]');
                modals.forEach(function (trigger) {
                    trigger.addEventListener('click', function (event) {
                      event.preventDefault();
                      const modal = document.getElementById("modal-" + trigger.getAttribute('data-modal'));
                      modal.classList.add('open');
                      const exits = modal.querySelectorAll('.modal-exit');
                      exits.forEach(function (exit) {
                        exit.addEventListener('click', function (event) {
                          event.preventDefault();
                          modal.classList.remove('open');
                        });
                      });
                    });
                  });
            }

        }
    }, [ready])
    if(!active){
        return children;
    }


    return children

}

export default ProjectSelect;