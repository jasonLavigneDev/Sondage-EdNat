<script>
  import { _ } from 'svelte-i18n';
  import Bowser from 'bowser';
  import { toast } from '@zerodevx/svelte-toast';
  import PackageJSON from '../../../package.json';
  import Modal from '../components/common/Modal.svelte';

  const bowser = Bowser.parse(window.navigator.userAgent);
  const { browser, os, platform } = bowser;

  let version = PackageJSON.version;
  $: mobile = () => window.innerWidth < 768;

  let showModal = false;
  const toggleShowModal = () => (showModal = !showModal);

  const handleClickModal = () => {
    navigator.clipboard.writeText(
      `Navigateur: ${browser.name},
                 Version: ${JSON.stringify(browser.version)},
                 Os: ${JSON.stringify(os.name)},
                 Appareil: ${JSON.stringify(platform.type)}`,
    );
    toast.push($_('pages.AboutPage.Modal.success'));
    showModal = false;
  };
</script>

<div class="containerPaper">
  <div class="imgContainer">
    <img class="imageSize" src="/puce_eole.png" alt="puce eole" />
  </div>
  <div class="textZone">
    <h1 class="title is-1">
      <i class="titleH1" style="color: #372F84">Sondage - version {version}</i>
    </h1>
    <p>
      {$_('pages.AboutPage.developped')}{' '}
      <a title="EUPL 1.2" target="_blank" rel="noreferrer noopener" href="https://eupl.eu/1.2/fr/"> EUPL 1.2 </a>{' '}
      {$_('pages.AboutPage.socle')}{' '}
      <a title="EOLE 3" target="_blank" rel="noreferrer noopener" href="https://pcll.ac-dijon.fr/eole/eole-3/">
        EOLE³
      </a>
    </p>
    <p>
      {$_('pages.AboutPage.by')}{' '}
      <a title="PCLL" target="_blank" rel="noreferrer noopener" href="https://pcll.ac-dijon.fr/pcll/">
        Pôle de Compétences Logiciels Libres
      </a>{' '}
      {$_('pages.AboutPage.and')}{' '}
      <a title="MENJ" target="_blank" rel="noreferrer noopener" href="https://www.education.gouv.fr/">
        Ministère de l`&apos;`Éducation Nationale et de la Jeunesse
      </a>{' '}
      {$_('pages.AboutPage.contributions')}{' '}
      <a title="DINUM" target="_blank" rel="noreferrer noopener" href="https://www.numerique.gouv.fr/dinum/">
        Direction Interministérielle du Numérique
      </a>{' '}
      {$_('pages.AboutPage.external')}
    </p>
    <p>
      {$_('pages.AboutPage.links')}{' '}
      <a title="wiki eole" target="_blank" rel="noreferrer noopener" href="https://wiki.eole.education/">
        documentation de l'application.
      </a>
    </p>
    <p>
      {$_('pages.AboutPage.exchange')}{' '}
      <a title={$_('pages.AboutPage.chat')} target="_blank" rel="noreferrer noopener" href="https://chat.mim-libre.fr">
        {$_('pages.AboutPage.chat')}.
      </a>
    </p>
    <p>
      {$_('pages.AboutPage.news')}{' '}
      <a title="Mastodon" target="_blank" rel="noreferrer noopenner" href="https://mastodon.eole.education/@EOLE">
        Mastodon.
      </a>
    </p>
    <p>
      {$_('pages.AboutPage.contributing')}{' '}
      <a
        title={$_('pages.AboutPage.deposit')}
        target="_blank"
        rel="noreferrer noopenner"
        href="https://gitlab.mim-libre.fr/alphabet/sondage"
      >
        {$_('pages.AboutPage.deposit')}.
      </a>
    </p>
    <br />
    <button class=" button buttonInfos" on:click={() => (showModal = true)}>
      {$_('pages.AboutPage.information')}
    </button>
  </div>
</div>

<Modal
  toggle={toggleShowModal}
  active={showModal}
  action={handleClickModal}
  title={$_('pages.AboutPage.Modal.information')}
  validButton={$_('pages.AboutPage.Modal.copy')}
  validClass="is-success"
  cancelClass="is-warning"
  cancelButton={$_('pages.AboutPage.Modal.close')}
>
  <p>
    {$_('pages.AboutPage.Modal.navigator')}
    {JSON.stringify(browser.name)}
  </p>
  <p>
    {$_('pages.AboutPage.Modal.version')}
    {JSON.stringify(browser.version)}
  </p>
  <p>
    {$_('pages.AboutPage.Modal.os')}
    {JSON.stringify(os.name)}
  </p>
  <p>
    {$_('pages.AboutPage.Modal.device')}
    {JSON.stringify(platform.type)}
  </p>
</Modal>

<style>
  .imageSize {
    height: 10vw;
    place-content: center;
  }
  .titleH1 {
    font-family: WorkSansBold;
  }
  .containerPaper {
    display: flex;
    flex-direction: row;
    height: 80vh;
    padding: 10;
    place-items: center;
    background-color: #fff;
    color: #040d3e;
    -webkit-transition: box-shadow 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
    transition: box-shadow 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
    border-radius: 8px;
    box-shadow:
      0px 2px 1px -1px rgba(0, 0, 0, 0.2),
      0px 1px 1px 0px rgba(0, 0, 0, 0.14),
      0px 1px 3px 0px rgba(0, 0, 0, 0.12);
  }
  .imgContainer {
    display: flex;
    width: 25%;
    justify-content: center;
  }
  .textZone {
    width: 50vw;
  }
  .buttonInfos {
    align-items: center;
    justify-content: center;
    vertical-align: middle;
    font-family: WorkSansRegular;
    font-weight: 500;
    font-size: 0.875rem;
    line-height: 1.75;
    text-transform: uppercase;
    min-width: 64px;
    padding: 6px 16px;
    border-radius: 8px;
    color: #fff;
    background-color: #011caa;
    border: none;
  }

  @media screen and (max-width: 768px) {
    .containerPaper {
      padding: 6px 0px;
      overflow: auto;
      flex-direction: column;
      height: 90vh;
    }

    .buttonInfos {
      margin-bottom: 5vh;
    }

    .textZone {
      width: 90%;
    }
  }
</style>
