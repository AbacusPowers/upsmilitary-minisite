<?php

namespace UPS\VCGBundle\Command;

use Symfony\Bundle\FrameworkBundle\Command\ContainerAwareCommand;
//use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Input\ArrayInput;
//use Symfony\Component\Console\Input\InputOption;
use Symfony\Component\Console\Output\OutputInterface;
//use Symfony\Component\Console\Formatter\OutputFormatterStyle;

use Symfony\Component\DomCrawler\Crawler;
//use Symfony\Component\HttpKernel\Client;
//use Symfony\Component\HttpKernel\HttpKernelInterface;
//use Symfony\Component\HttpFoundation\Response;

use Symfony\Component\Filesystem\Filesystem;
use Symfony\Component\Filesystem\Exception\IOExceptionInterface;

use Symfony\Component\Process\Process;

class SiteExportCommand extends ContainerAwareCommand
{
    /**
     * @var OutputInterface
     */
    protected $output;

    /**
     * @var Array
     */
    private $urls = array(
        '/transition-guide/dd-form-214-guide.html',
        '/transition-guide/not-a-real-page'
    );

    /**
     * Configure
     *
     * @author  Justin Maurer <justin@360zen.com
     */



    protected function configure() {
        $this
            ->setName('ups:crawl:export')
            ->setDescription('Export site to flat file setup')
            ->setHelp(<<<EOT
                The <info>ups:crawl:export</info> command crawls the UPS site with a fixed list of URLs.

                This will overwrite previously exported files.
EOT
            )
            ->addOption('dry-run', 'dry', null, 'Print a list of URLs to be exported, instead of writing files.')
        ;
    }


    protected function execute(InputInterface $input, OutputInterface $output) {
        $kernel = $this->_createKernel();
        $client = $kernel->getContainer()->get( 'test.client' );
        $dryRun = $input->getOption('dry-run');
        $this->writeSite($client, $dryRun, $output);
        $output->writeln('Everything is fine');
    }


    protected function _createKernel() {

        $rootDir = $this->getContainer()->get( 'kernel' )->getRootDir();
        require_once( $rootDir . '/AppKernel.php' );
        $kernel = new \AppKernel( 'test', true );
        $kernel->boot();

        return $kernel;
    }

    protected function dumpAssets(OutputInterface $output)
    {
        $command = $this->getApplication()->find('assetic:dump');

        $arguments = array(
            'command' => 'assetic:dump'
        );

        $input = new ArrayInput($arguments);
        $command->run($input, $output);

        $output->writeln('Dumping assets');
    }

    protected function writeSite($client, $dryRun, OutputInterface $output) {

        $fs = new Filesystem();

        $urls = $this->urls;
        foreach ( $urls as $url ) {
            //find last slash
            $pos = strrpos($url, '/' );

            //slug starts 1 position after last slash
            $slugStart = -(strlen($url) - $pos - 1);

            //parse slug
            $slug = substr($url, $slugStart);

            //parse folder path
            $folderPath = 'site-export' . substr($url, 0, $slugStart);

            if ($dryRun == true) {
                if ( $fs->exists($folderPath) ) {
                    $output->writeln('Folder path ' . $folderPath . ' exists.' );
                } else {
                    $output->writeln('Folder path ' . $folderPath . ' will be created.' );
                }
                try {
                    $response = $client->request( 'GET', $url );
                    $statusCode = $client->getResponse()->getStatusCode();
                    if ($statusCode != 200) {
                        throw new \Exception("Page Does Not Exist", 3489);
                    }
                    var_dump($statusCode);
//                    $output->writeln($response);
                    $output->writeln('<fg=green>'.$slug . ' will be written to ' . $folderPath.$slug.'</fg=green>' );
                } catch (\Exception $ex) {
                    $output->writeln('<fg=red>Nothing found at ' . $url .'</fg=red>' );
                }
            } else {
                $this->dumpAssets($output);
                try {
                    //create appropriate folder in ROOT/site-export/
                    $fs->mkdir($folderPath);
                } catch (IOExceptionInterface $e) {
                    //something went wrong
                    echo "An error occurred while creating your directory at ".$e->getPath();
                }
                $crawler = $client->request( 'GET', $url );
                $statusCode = $client->getResponse()->getStatusCode();
                if($statusCode == 200) {
                    $fs->dumpFile($folderPath . $slug, "<!DOCTYPE html>\n<html>\n" . $crawler->html() . "\n</html>");
                    $output->writeln($slug . ' has been written to ' . $folderPath . $slug);

                    $output->writeln('assets have been copied to /site-export/bundles');
                }else{
                    if ( $fs->exists($folderPath . $slug) ) {
                        unlink($folderPath . $slug);
                    }
                }
            }

        }

        if($dryRun != true){
            $this->dumpAssets($output);
            $fs->copy('web/favicon.ico','site-export/favicon.ico')
            $fs->mirror('web/css', 'site-export/css');
            $fs->mirror('web/js', 'site-export/js');
            $fs->mirror('web/bundles', 'site-export/bundles');
        }
    }
}