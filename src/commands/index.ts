import type { Editor } from 'grapesjs';
import { RequiredPluginOptions } from '..';
import { mjmlConvert } from '../components/utils';
import openExportMjml from './openExportMjml';
import openImportMjml from './openImportMjml';

export const cmdDeviceDesktop = 'set-device-desktop';
export const cmdDeviceTablet = 'set-device-tablet';
export const cmdDeviceMobile = 'set-device-mobile';
export const cmdImportMjml = 'mjml-import';
export const cmdExportMjml = 'mjml-export';
export const cmdGetMjml = 'mjml-code';
export const cmdGetMjmlToHtml = 'mjml-code-to-html';

export default (editor: Editor, opts: RequiredPluginOptions) => {
  const { Commands } = editor;
  const cmdOpenExport = opts.overwriteExport ? 'export-template' : cmdExportMjml;

  Commands.add(cmdGetMjml, (ed, _, opt) => {
    opt = {
      component: null,
      preMjml: '',
      postMjml: '',
      ...opt,
    }

    return `${opts.preMjml}${opt.preMjml}${editor.getHtml({ component: opt.component }).trim()}${opt.postMjml}${opts.postMjml}`;
  });

  Commands.add(cmdGetMjmlToHtml, (ed, _, opt) => {
    opt = {
      component: null,
      preMjml: '',
      postMjml: '',
      ...opt,
    }

    const { component, preMjml, postMjml, ...convertOpt } = opt

    const mjml = Commands.run(cmdGetMjml, { component, preMjml, postMjml });
    return mjmlConvert(mjml, opts.fonts, convertOpt);
  });

  openExportMjml(editor, opts, cmdOpenExport);
  openImportMjml(editor, opts, cmdImportMjml);

  // Device commands
  Commands.add(cmdDeviceDesktop, {
    run: ed => ed.setDevice('Desktop'),
    stop: () => {},
  });
  Commands.add(cmdDeviceTablet, {
    run: ed => ed.setDevice('Tablet'),
    stop: () => {},
  });
  Commands.add(cmdDeviceMobile, {
    run: ed => ed.setDevice('Mobile portrait'),
    stop: () => {},
  });

};
